import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang, t } from '../contexts/LangContext';

/**
 * Dashboard analytics du backend Pixel Tactics 3D (serveur de matchmaking
 * classé, ranked.sharik.fr). Lit /analytics/summary — un rapport déjà agrégé
 * et pseudonymisé côté serveur : cette page ne fait que le mettre en forme,
 * elle ne recalcule rien à partir de données brutes.
 */

const API = 'https://ranked.sharik.fr';

// ─── Types (miroir de summary() dans src/analytics.js) ───────────────────────

interface Tally { key: string; count: number }
interface DailyRow { day: string; players: number; sessions: number; matches: number; ranked: number; custom: number }
interface HourRow { hour: string; online: number; queue: number; matches: number }
interface RetentionRow { eligible: number; returned: number; pct: number | null }
interface BoardRow { rank: number; id: string; name: string; mmr: number; wins: number; losses: number; games: number }

interface Summary {
  generated: number;
  windowDays: number;
  retentionDays: number;
  eventCount: number;
  live: { online: number; queue: number; custom: number; matches: number };
  kpi: {
    playersTotal: number; playersWindow: number; players24h: number;
    sessions24h: number; sessionsWindow: number;
    matches24h: number; matchesWindow: number;
    matchDurationMedian: number; matchDurationMean: number;
    sessionDurationMedian: number;
    queueWaitMedian: number; queueWaitMean: number;
    queueJoins: number; queueAbandons: number; peakOnline: number;
  };
  daily: DailyRow[];
  concurrency: HourRow[];
  splits: { provider: Tally[]; matchType: Tally[]; endReason: Tally[]; customMaps: Tally[]; mmr: Tally[] };
  hostAdvantage: { matches: number; hostWins: number; pct: number | null };
  retention: { d1: RetentionRow; d7: RetentionRow };
  leaderboard: BoardRow[];
}

// ─── Palette data-viz ────────────────────────────────────────────────────────
// Deux séries au maximum par graphe (slots 1 et 2 de la palette catégorielle) :
// validées ΔE CVD 24.7 en clair / 26.8 en sombre, contraste ≥ 3:1 sur les deux
// surfaces de carte du site (#FFFFFF et #1C1C1E).

const VizStyle = () => (
  <style>{`
    .pt-viz {
      --s1: #2a78d6;  /* série 1 — bleu   (classé / joueurs en ligne) */
      --s2: #eb6834;  /* série 2 — orange (perso  / file d'attente)   */
      --grid: rgba(0,0,0,0.07);
      --axis: #86868B;
    }
    html.dark .pt-viz {
      --s1: #3987e5;
      --s2: #d95926;
      --grid: rgba(255,255,255,0.09);
      --axis: #636366;
    }
  `}</style>
);

// ─── Formatage ───────────────────────────────────────────────────────────────

/** Durée en secondes → « 4 min 20 s » / « 45 s » / « 1 h 05 ». */
function dur(s: number): string {
  if (!s || s <= 0) return '—';
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ${String(s % 60).padStart(2, '0')} s`;
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`;
}

/** « 2026-07-26 » → « 26/07 ». */
function shortDay(iso: string): string {
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}

/** « 2026-07-26T21:00 » → « 21 h ». */
function shortHour(iso: string): string {
  return `${iso.slice(11, 13)} h`;
}

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

// ─── Primitives d'UI ─────────────────────────────────────────────────────────

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="mb-3">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">{children}</div>
    {hint && <div className="text-[11px] text-[#86868B] dark:text-[#636366] mt-0.5">{hint}</div>}
  </div>
);

const Stat: React.FC<{ label: string; value: string | number; sub?: string }> = ({ label, value, sub }) => (
  <Card className="p-4">
    <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-2">{label}</div>
    <div className="text-[26px] font-bold tracking-tight text-[#1D1D1F] dark:text-white leading-none tabular-nums">{value}</div>
    {sub && <div className="text-[11px] text-[#86868B] dark:text-[#636366] mt-1">{sub}</div>}
  </Card>
);

/** Pastille de légende — l'identité d'une série ne repose jamais sur la seule couleur. */
const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#6E6E73] dark:text-[#98989D]">
    <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: color }} />
    {label}
  </span>
);

/**
 * Étiquettes d'axe X, en HTML et non en <text> SVG. Les graphes utilisent
 * `preserveAspectRatio="none"` pour occuper toute la largeur sans avoir à
 * mesurer leur conteneur : l'étirement horizontal qui en découle déforme le
 * texte SVG (les lettres s'aplatissent). Positionner les libellés en HTML,
 * au-dessus du SVG, les laisse à leur taille réelle.
 */
const AxisLabels: React.FC<{ labels: string[]; at: (i: number) => number }> = ({ labels, at }) => {
  // Au-delà de ~8 étiquettes elles se chevauchent : on n'en garde qu'une sur N.
  const every = Math.ceil(labels.length / 8);
  return (
    <div className="relative h-4 mt-1">
      {labels.map((l, i) => {
        if (i % every !== 0) return null;
        const x = at(i);
        // Aux extrémités, un centrage strict ferait déborder l'étiquette hors
        // de la carte : on la fait pivoter sur son bord côté intérieur.
        const shift = x <= 2 ? '0' : x >= 98 ? '-100%' : '-50%';
        return (
          <span key={i}
            className="absolute text-[10px] text-[#86868B] dark:text-[#636366] whitespace-nowrap"
            style={{ left: `${x}%`, transform: `translateX(${shift})` }}>
            {l}
          </span>
        );
      })}
    </div>
  );
};

/** Infobulle en coordonnées écran : le SVG ne peut pas déborder de son cadre. */
const Tip: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <div
    className="pointer-events-none fixed z-50 px-2.5 py-1.5 rounded-lg bg-[#1D1D1F] dark:bg-[#2C2C2E] text-white text-[11px] shadow-lg whitespace-nowrap"
    style={{ left: x + 12, top: y - 8 }}
  >
    {children}
  </div>
);

// ─── Barres empilées (matchs classés / perso par jour) ───────────────────────

const StackedBars: React.FC<{ rows: DailyRow[]; labels: { ranked: string; custom: string } }> = ({ rows, labels }) => {
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const max = Math.max(1, ...rows.map(r => r.matches));
  const plot = 128;
  // Le viewBox fait 100 de large et la grille CSS l'étire : pas de mesure du
  // conteneur ni de gestion du resize à écrire.
  const step = 100 / Math.max(1, rows.length);
  const barW = Math.min(step * 0.62, 3.2);

  return (
    <div className="relative">
      <svg viewBox={`0 0 100 ${plot}`} preserveAspectRatio="none" className="w-full" style={{ height: plot }}>
        {[0, 0.5, 1].map(g => (
          <line key={g} x1="0" x2="100" y1={plot - g * plot} y2={plot - g * plot}
            stroke="var(--grid)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        {rows.map((r, i) => {
          const cx = step * (i + 0.5);
          const hR = (r.ranked / max) * plot;
          const hC = (r.custom / max) * plot;
          // 2 px de vide entre les deux segments : sans lui, un empilement
          // bleu/orange se lit comme une seule barre bicolore.
          const gap = hR > 0 && hC > 0 ? 2 : 0;
          return (
            <g key={r.day}
              onMouseMove={e => setHover({ i, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHover(null)}>
              <rect x={cx - step / 2} y={0} width={step} height={plot} fill="transparent" />
              {hR > 0 && <rect x={cx - barW / 2} y={plot - hR} width={barW} height={hR} rx="1" fill="var(--s1)" />}
              {hC > 0 && <rect x={cx - barW / 2} y={plot - hR - gap - hC} width={barW} height={hC} rx="1" fill="var(--s2)" />}
            </g>
          );
        })}
      </svg>
      <AxisLabels labels={rows.map(r => shortDay(r.day))} at={i => step * (i + 0.5)} />
      {hover && (
        <Tip x={hover.x} y={hover.y}>
          <div className="font-semibold mb-0.5">{shortDay(rows[hover.i].day)}</div>
          <div>{labels.ranked} : {rows[hover.i].ranked}</div>
          <div>{labels.custom} : {rows[hover.i].custom}</div>
        </Tip>
      )}
      <div className="flex gap-4 mt-2">
        <LegendDot color="var(--s1)" label={labels.ranked} />
        <LegendDot color="var(--s2)" label={labels.custom} />
      </div>
    </div>
  );
};

// ─── Courbe (une ou deux séries) ─────────────────────────────────────────────

const LineChart: React.FC<{ points: { label: string; a: number; b?: number }[]; names: [string, string?] }> = ({ points, names }) => {
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const hasB = points.some(p => p.b !== undefined);
  const max = Math.max(1, ...points.flatMap(p => [p.a, p.b ?? 0]));
  const plot = 128;
  const px = (i: number) => points.length === 1 ? 50 : (i / (points.length - 1)) * 100;
  const py = (v: number) => plot - (v / max) * plot;
  const path = (get: (p: typeof points[0]) => number) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(get(p))}`).join(' ');

  return (
    <div className="relative">
      <svg viewBox={`0 0 100 ${plot}`} preserveAspectRatio="none" className="w-full" style={{ height: plot }}>
        {[0, 0.5, 1].map(g => (
          <line key={g} x1="0" x2="100" y1={plot - g * plot} y2={plot - g * plot}
            stroke="var(--grid)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={path(p => p.a)} fill="none" stroke="var(--s1)" strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {hasB && (
          <path d={path(p => p.b ?? 0)} fill="none" stroke="var(--s2)" strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        )}
        {hover && (
          <line x1={px(hover.i)} x2={px(hover.i)} y1="0" y2={plot} stroke="var(--axis)"
            strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 3" />
        )}
        {points.map((_, i) => (
          <rect key={`hit-${i}`} x={px(i) - 50 / points.length} y={0}
            width={100 / points.length} height={plot} fill="transparent"
            onMouseMove={e => setHover({ i, x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setHover(null)} />
        ))}
      </svg>
      <AxisLabels labels={points.map(p => p.label)} at={px} />
      {hover && (
        <Tip x={hover.x} y={hover.y}>
          <div className="font-semibold mb-0.5">{points[hover.i].label}</div>
          <div>{names[0]} : {points[hover.i].a}</div>
          {hasB && <div>{names[1]} : {points[hover.i].b}</div>}
        </Tip>
      )}
      {hasB && (
        <div className="flex gap-4 mt-2">
          <LegendDot color="var(--s1)" label={names[0]} />
          <LegendDot color="var(--s2)" label={names[1] ?? ''} />
        </div>
      )}
    </div>
  );
};

// ─── Liste de barres horizontales (répartitions) ─────────────────────────────

const BarList: React.FC<{ items: Tally[]; empty: string }> = ({ items, empty }) => {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (!items.length) return <div className="text-[12px] text-[#86868B] dark:text-[#636366]">{empty}</div>;
  return (
    <div className="space-y-2">
      {items.map(({ key, count }) => (
        <div key={key}>
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[12px] text-[#1D1D1F] dark:text-[#F5F5F7] truncate max-w-[65%]">{key}</span>
            <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D] shrink-0 ml-2 tabular-nums">
              {count} · {pct(count, total)} %
            </span>
          </div>
          <div className="h-1.5 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-full overflow-hidden">
            <div className="h-full rounded-full"
              style={{ width: `${pct(count, total)}%`, background: 'var(--s1)', transition: 'width .6s ease' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Histogramme MMR ─────────────────────────────────────────────────────────

const Histogram: React.FC<{ items: Tally[]; empty: string; unit: string }> = ({ items, empty, unit }) => {
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  if (!items.length) return <div className="text-[12px] text-[#86868B] dark:text-[#636366]">{empty}</div>;
  const max = Math.max(...items.map(i => i.count));
  return (
    <div className="relative">
      <div className="flex items-end gap-1.5" style={{ height: 120 }}>
        {items.map((it, i) => (
          <div key={it.key} className="flex-1 flex flex-col justify-end h-full"
            onMouseMove={e => setHover({ i, x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setHover(null)}>
            <div className="rounded-t-[4px]"
              style={{ height: `${(it.count / max) * 100}%`, background: 'var(--s1)', minHeight: 3 }} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {items.map(it => (
          <div key={it.key} className="flex-1 text-center text-[9px] text-[#86868B] dark:text-[#636366] truncate">
            {it.key.split('–')[0]}
          </div>
        ))}
      </div>
      {hover && <Tip x={hover.x} y={hover.y}>{items[hover.i].key} : {items[hover.i].count} {unit}</Tip>}
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────

const GameAnalyticsPage: React.FC = () => {
  const { lang } = useLang();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const daysRef = useRef(days);
  daysRef.current = days;

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}/analytics/summary?days=${daysRef.current}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setData(await r.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { setLoading(true); load(); }, [days, load]);
  // Rafraîchissement auto : les jauges temps réel (joueurs en ligne, file)
  // n'ont d'intérêt que fraîches. 30 s reste discret pour le serveur.
  useEffect(() => {
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [load]);

  const T = {
    title: 'Analytics — Pixel Tactics 3D',
    subtitle: t(lang, 'Serveur de matchmaking classé · ranked.sharik.fr', 'Ranked matchmaking server · ranked.sharik.fr'),
    back: t(lang, '← Visiteurs', '← Visitors'),
    refresh: t(lang, 'Actualiser', 'Refresh'),
    live: t(lang, 'En direct', 'Live'),
    online: t(lang, 'Joueurs en ligne', 'Players online'),
    queueNow: t(lang, 'En file classée', 'In ranked queue'),
    customNow: t(lang, 'En file perso', 'In custom queue'),
    matchesNow: t(lang, 'Parties en cours', 'Live matches'),
    playersTotal: t(lang, 'Comptes créés', 'Accounts created'),
    activePlayers: t(lang, 'actifs', 'active'),
    players24h: t(lang, 'Joueurs (24 h)', 'Players (24h)'),
    sessions: t(lang, 'Sessions', 'Sessions'),
    matches: t(lang, 'Parties jouées', 'Matches played'),
    matches24h: t(lang, 'sur 24 h', 'in 24h'),
    matchDur: t(lang, 'Durée de partie', 'Match duration'),
    sessionDur: t(lang, 'Durée de session', 'Session length'),
    queueWait: t(lang, 'Attente en file', 'Queue wait'),
    peak: t(lang, 'Pic de joueurs', 'Peak players'),
    median: t(lang, 'médiane', 'median'),
    mean: t(lang, 'moy.', 'avg'),
    overWindow: t(lang, 'sur la période', 'over the window'),
    activity: t(lang, 'Parties par jour', 'Matches per day'),
    ranked: t(lang, 'Classé', 'Ranked'),
    custom: t(lang, 'Perso', 'Custom'),
    audience: t(lang, 'Joueurs uniques et sessions par jour', 'Unique players and sessions per day'),
    uniquePlayers: t(lang, 'Joueurs uniques', 'Unique players'),
    concurrency: t(lang, 'Activité simultanée (48 h)', 'Concurrent activity (48h)'),
    concurrencyHint: t(lang, 'Maximum par heure, échantillonné toutes les 5 min', 'Hourly maximum, sampled every 5 min'),
    provider: t(lang, 'Méthode de connexion', 'Sign-in method'),
    matchType: t(lang, 'Type de partie', 'Match type'),
    endReason: t(lang, 'Fin de partie', 'How matches end'),
    endReasonHint: t(lang, 'Une part de « contesté » qui monte = suspicion de triche',
      'A rising “contested” share signals possible cheating'),
    maps: t(lang, 'Cartes en partie perso', 'Custom game maps'),
    mmr: t(lang, 'Répartition du MMR', 'MMR distribution'),
    mmrUnit: t(lang, 'joueur(s)', 'player(s)'),
    hostAdv: t(lang, 'Avantage de l’hôte', 'Host advantage'),
    hostAdvHint: t(lang, 'L’hôte joue OrangeStar et commence. Un écart durable au-dessus de 50 % signale un déséquilibre du premier tour.',
      'The host plays OrangeStar and moves first. A lasting gap above 50% points to a first-turn imbalance.'),
    hostWins: t(lang, 'victoires de l’hôte', 'host wins'),
    retention: t(lang, 'Rétention', 'Retention'),
    retentionHint: t(lang, 'Part des nouveaux joueurs revenus 1 et 7 jours plus tard. Les cohortes trop récentes sont exclues.',
      'Share of new players returning 1 and 7 days later. Cohorts too recent to measure are excluded.'),
    ofCohort: t(lang, 'de la cohorte', 'of cohort'),
    notEnough: t(lang, 'Pas encore assez de recul', 'Not enough history yet'),
    board: t(lang, 'Classement', 'Leaderboard'),
    player: t(lang, 'Joueur', 'Player'),
    games: t(lang, 'Parties', 'Games'),
    winrate: t(lang, 'Victoires', 'Win rate'),
    funnel: t(lang, 'Entonnoir de la file classée', 'Ranked queue funnel'),
    queueJoins: t(lang, 'Recherches lancées', 'Searches started'),
    queueAbandons: t(lang, 'Recherches abandonnées', 'Searches abandoned'),
    matched: t(lang, 'Recherches abouties', 'Searches matched'),
    tableView: t(lang, 'Voir les données', 'View data'),
    hideTable: t(lang, 'Masquer les données', 'Hide data'),
    day: t(lang, 'Jour', 'Day'),
    noData: t(lang, 'Aucune donnée', 'No data'),
    loading: t(lang, 'Chargement…', 'Loading…'),
    errPrefix: t(lang, 'Serveur injoignable', 'Server unreachable'),
    updated: t(lang, 'Mis à jour', 'Updated'),
    events: t(lang, 'événements journalisés', 'events logged'),
    privacy: t(lang, 'Identifiants joueur hachés côté serveur — aucune donnée personnelle n’est journalisée.',
      'Player IDs are hashed server-side — no personal data is logged.'),
  };

  const endReasonLabel = useCallback((k: string) => ({
    agreed: t(lang, 'Accord des deux camps', 'Both sides agreed'),
    forfeit: t(lang, 'Forfait (déconnexion)', 'Forfeit (disconnect)'),
    contested: t(lang, 'Résultat contesté', 'Contested result'),
    solo_report: t(lang, 'Déclaré par un seul camp', 'Reported by one side'),
    abandoned: t(lang, 'Abandonnée par les deux', 'Abandoned by both'),
  } as Record<string, string>)[k] ?? k, [lang]);

  const providerLabel = useCallback((k: string) => ({
    google: 'Google',
    gamecenter: 'Game Center',
    guest: t(lang, 'Invité', 'Guest'),
  } as Record<string, string>)[k] ?? k, [lang]);

  const audiencePoints = useMemo(
    () => (data?.daily ?? []).map(d => ({ label: shortDay(d.day), a: d.players, b: d.sessions })),
    [data],
  );
  const concurrencyPoints = useMemo(
    () => (data?.concurrency ?? []).map(h => ({ label: shortHour(h.hour), a: h.online, b: h.queue })),
    [data],
  );

  const k = data?.kpi;
  const matchedSearches = k ? Math.max(0, k.queueJoins - k.queueAbandons) : 0;

  return (
    <div className="pt-viz min-h-screen bg-[#F5F5F7] dark:bg-black text-[#1D1D1F] dark:text-[#F5F5F7] px-4 py-8 transition-colors duration-300">
      <VizStyle />
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">{T.title}</h1>
            <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">{T.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/dash"
              className="h-8 px-3 flex items-center rounded-lg bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] text-[12px] font-medium hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-colors">
              {T.back}
            </Link>
            {/* Filtres sur un seul rang, au-dessus des graphes. */}
            <div className="flex rounded-lg overflow-hidden border border-black/[0.08] dark:border-white/[0.08]">
              {[7, 30, 90].map(d => (
                <button key={d} onClick={() => setDays(d)}
                  className={`h-8 px-3 text-[12px] font-medium transition-colors ${
                    days === d
                      ? 'bg-[#0071E3] text-white'
                      : 'bg-white dark:bg-[#1C1C1E] text-[#6E6E73] dark:text-[#98989D] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E]'
                  }`}>
                  {d} j
                </button>
              ))}
            </div>
            <button onClick={load}
              className="h-8 px-3 rounded-lg bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] text-[12px] font-medium text-[#0071E3] hover:bg-[#E8F2FC] dark:hover:bg-[#0A2540] transition-colors">
              {T.refresh}
            </button>
          </div>
        </div>

        {error && (
          <Card className="p-4 mb-6">
            <div className="text-[13px] text-[#FF3B30] font-medium">{T.errPrefix} · {error}</div>
          </Card>
        )}

        {loading && !data ? (
          <div className="flex items-center justify-center py-24 text-[13px] text-[#86868B] dark:text-[#636366]">
            {T.loading}
          </div>
        ) : data && k ? (
          <>
            {/* Bandeau temps réel */}
            <Card className="p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-[#34C759] opacity-70" />
                  <span className="relative rounded-full h-2 w-2 bg-[#34C759]" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">{T.live}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {([[T.online, data.live.online], [T.queueNow, data.live.queue],
                   [T.customNow, data.live.custom], [T.matchesNow, data.live.matches]] as [string, number][]).map(([label, v]) => (
                  <div key={label}>
                    <div className="text-[24px] font-bold tabular-nums leading-none">{v}</div>
                    <div className="text-[11px] text-[#86868B] dark:text-[#636366] mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Stat label={T.playersTotal} value={k.playersTotal} sub={`${k.playersWindow} ${T.activePlayers} · ${days} j`} />
              <Stat label={T.players24h} value={k.players24h} sub={`${k.sessions24h} ${T.sessions.toLowerCase()}`} />
              <Stat label={T.matches} value={k.matchesWindow} sub={`${k.matches24h} ${T.matches24h}`} />
              <Stat label={T.peak} value={k.peakOnline} sub={T.overWindow} />
              <Stat label={T.matchDur} value={dur(k.matchDurationMedian)} sub={`${T.median} · ${T.mean} ${dur(k.matchDurationMean)}`} />
              <Stat label={T.sessionDur} value={dur(k.sessionDurationMedian)} sub={T.median} />
              <Stat label={T.queueWait} value={dur(k.queueWaitMedian)} sub={`${T.median} · ${T.mean} ${dur(k.queueWaitMean)}`} />
              <Stat label={T.sessions} value={k.sessionsWindow} sub={`${days} j`} />
            </div>

            {/* Séries temporelles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
              <Card className="p-4">
                <CardTitle>{T.activity}</CardTitle>
                <StackedBars rows={data.daily} labels={{ ranked: T.ranked, custom: T.custom }} />
              </Card>
              <Card className="p-4">
                <CardTitle>{T.audience}</CardTitle>
                <LineChart points={audiencePoints} names={[T.uniquePlayers, T.sessions]} />
              </Card>
            </div>

            <Card className="p-4 mb-6">
              <CardTitle hint={T.concurrencyHint}>{T.concurrency}</CardTitle>
              {concurrencyPoints.length
                ? <LineChart points={concurrencyPoints} names={[T.online, T.queueNow]} />
                : <div className="text-[12px] text-[#86868B] dark:text-[#636366] py-8 text-center">{T.noData}</div>}
            </Card>

            {/* Vue tabulaire — les valeurs restent lisibles sans couleur. */}
            <div className="mb-6">
              <button onClick={() => setShowTable(v => !v)}
                className="text-[12px] font-medium text-[#0071E3] hover:underline">
                {showTable ? T.hideTable : T.tableView}
              </button>
              {showTable && (
                <Card className="mt-2 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                        {[T.day, T.uniquePlayers, T.sessions, T.matches, T.ranked, T.custom].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#636366] whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.daily.map(d => (
                        <tr key={d.day} className="border-b border-black/[0.04] dark:border-white/[0.04]">
                          <td className="px-3 py-1.5 text-[11px] font-mono">{d.day}</td>
                          {[d.players, d.sessions, d.matches, d.ranked, d.custom].map((v, i) => (
                            <td key={i} className="px-3 py-1.5 text-[11px] tabular-nums text-[#6E6E73] dark:text-[#98989D]">{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}
            </div>

            {/* Répartitions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <Card className="p-4">
                <CardTitle>{T.provider}</CardTitle>
                <BarList items={data.splits.provider.map(i => ({ ...i, key: providerLabel(i.key) }))} empty={T.noData} />
              </Card>
              <Card className="p-4">
                <CardTitle>{T.matchType}</CardTitle>
                <BarList items={data.splits.matchType} empty={T.noData} />
              </Card>
              <Card className="p-4">
                <CardTitle hint={T.endReasonHint}>{T.endReason}</CardTitle>
                <BarList items={data.splits.endReason.map(i => ({ ...i, key: endReasonLabel(i.key) }))} empty={T.noData} />
              </Card>
              <Card className="p-4">
                <CardTitle>{T.maps}</CardTitle>
                <BarList items={data.splits.customMaps} empty={T.noData} />
              </Card>
            </div>

            {/* Équilibre & rétention */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
              <Card className="p-4">
                <CardTitle hint={T.hostAdvHint}>{T.hostAdv}</CardTitle>
                {data.hostAdvantage.pct === null ? (
                  <div className="text-[12px] text-[#86868B] dark:text-[#636366]">{T.noData}</div>
                ) : (
                  <>
                    <div className="text-[34px] font-bold tracking-tight tabular-nums leading-none">
                      {data.hostAdvantage.pct} %
                    </div>
                    <div className="text-[11px] text-[#86868B] dark:text-[#636366] mt-1 mb-3">
                      {data.hostAdvantage.hostWins} / {data.hostAdvantage.matches} {T.hostWins}
                    </div>
                    {/* Repère à 50 % : sans lui, « 58 % » ne dit pas s'il y a un problème. */}
                    <div className="relative h-2 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${data.hostAdvantage.pct}%`, background: 'var(--s1)' }} />
                      <div className="absolute top-0 bottom-0 w-px bg-[#1D1D1F] dark:bg-white" style={{ left: '50%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#86868B] dark:text-[#636366] mt-1">
                      <span>0 %</span><span>50 %</span><span>100 %</span>
                    </div>
                  </>
                )}
              </Card>

              <Card className="p-4">
                <CardTitle hint={T.retentionHint}>{T.retention}</CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  {([['D1', data.retention.d1], ['D7', data.retention.d7]] as [string, RetentionRow][]).map(([name, r]) => (
                    <div key={name}>
                      <div className="text-[11px] text-[#86868B] dark:text-[#636366] mb-1">{name}</div>
                      {r.pct === null ? (
                        <div className="text-[12px] text-[#86868B] dark:text-[#636366]">{T.notEnough}</div>
                      ) : (
                        <>
                          <div className="text-[28px] font-bold tabular-nums leading-none">{r.pct} %</div>
                          <div className="text-[11px] text-[#86868B] dark:text-[#636366] mt-1">
                            {r.returned} / {r.eligible} {T.ofCohort}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <CardTitle>{T.funnel}</CardTitle>
                <BarList
                  items={[
                    { key: T.queueJoins, count: k.queueJoins },
                    { key: T.matched, count: matchedSearches },
                    { key: T.queueAbandons, count: k.queueAbandons },
                  ].filter(i => i.count > 0)}
                  empty={T.noData} />
              </Card>
            </div>

            {/* MMR + classement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
              <Card className="p-4">
                <CardTitle>{T.mmr}</CardTitle>
                <Histogram items={data.splits.mmr} empty={T.noData} unit={T.mmrUnit} />
              </Card>

              <Card className="overflow-hidden">
                <div className="p-4 pb-2"><CardTitle>{T.board}</CardTitle></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                        {['#', T.player, 'MMR', T.games, T.winrate].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#636366] whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.leaderboard.length === 0 && (
                        <tr><td colSpan={5} className="px-3 py-6 text-center text-[12px] text-[#86868B] dark:text-[#636366]">{T.noData}</td></tr>
                      )}
                      {data.leaderboard.map(p => (
                        <tr key={p.id} className="border-b border-black/[0.04] dark:border-white/[0.04]">
                          <td className="px-3 py-2 text-[11px] font-mono text-[#86868B] dark:text-[#636366]">{p.rank}</td>
                          <td className="px-3 py-2 text-[12px] font-medium">{p.name}</td>
                          <td className="px-3 py-2 text-[12px] tabular-nums">{p.mmr}</td>
                          <td className="px-3 py-2 text-[11px] tabular-nums text-[#6E6E73] dark:text-[#98989D]">{p.games}</td>
                          <td className="px-3 py-2 text-[11px] tabular-nums text-[#6E6E73] dark:text-[#98989D]">{pct(p.wins, p.games)} %</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <footer className="text-center text-[11px] text-[#86868B] dark:text-[#636366] space-y-1">
              <div>
                {T.updated} {new Date(data.generated).toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                {' · '}{data.eventCount.toLocaleString()} {T.events}
              </div>
              <div>{T.privacy}</div>
            </footer>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GameAnalyticsPage;
