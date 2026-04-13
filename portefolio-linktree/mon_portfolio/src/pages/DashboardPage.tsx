import React, { useState, useEffect, useMemo } from 'react';
import { getVisitors, clearVisitors, exportVisitorsAsJson, VisitorData } from '../utils/visitorTracker';

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconMonitor = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function flag(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  return countryCode
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

function topN<T extends string>(arr: T[], n = 5): { key: T; count: number }[] {
  const map = new Map<T, number>();
  arr.forEach(v => map.set(v, (map.get(v) ?? 0) + 1));
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps { label: string; value: string | number; sub?: string; icon: React.ReactNode }
const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon }) => (
  <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
    <div className="flex items-center gap-2 text-[#6E6E73] dark:text-[#98989D] mb-2">
      {icon}
      <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-[28px] font-bold tracking-tight text-[#1D1D1F] dark:text-white leading-none">{value}</div>
    {sub && <div className="text-[11px] text-[#86868B] dark:text-[#636366] mt-1">{sub}</div>}
  </div>
);

interface BarListProps { title: string; items: { key: string; count: number }[]; total: number; emoji?: boolean }
const BarList: React.FC<BarListProps> = ({ title, items, total, emoji }) => (
  <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-3">{title}</div>
    <div className="space-y-2">
      {items.length === 0 && (
        <div className="text-[12px] text-[#86868B] dark:text-[#636366]">Aucune donnée</div>
      )}
      {items.map(({ key, count }) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[12px] text-[#1D1D1F] dark:text-[#F5F5F7] truncate max-w-[70%]">
                {emoji ? flag(key.slice(0, 2)) + ' ' : ''}{key || '—'}
              </span>
              <span className="text-[11px] text-[#6E6E73] dark:text-[#98989D] shrink-0 ml-2">{count} · {pct}%</span>
            </div>
            <div className="h-1.5 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0071E3] rounded-full"
                style={{ width: `${pct}%`, transition: 'width 0.6s ease' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

interface ExpandedRowProps { visitor: VisitorData }
const ExpandedRow: React.FC<ExpandedRowProps> = ({ visitor: v }) => {
  const fields: [string, string | number | boolean | undefined | null][] = [
    ['ID', v.id],
    ['User-Agent', v.userAgent],
    ['IP', v.ip ?? '—'],
    ['ISP / ASN', v.isp ? `${v.isp}${v.asn ? ` (${v.asn})` : ''}` : '—'],
    ['Pays', v.country ? `${flag(v.countryCode)} ${v.country}` : '—'],
    ['Région', v.region ?? '—'],
    ['Ville', v.city ?? '—'],
    ['Coordonnées', v.latitude != null ? `${v.latitude}, ${v.longitude}` : '—'],
    ['Fuseau horaire', v.timezone ?? '—'],
    ['Langue', v.language],
    ['Toutes langues', v.languages],
    ['Navigateur', `${v.browser} ${v.browserVersion}`],
    ['OS', v.os],
    ['Appareil', v.device],
    ['Plateforme', v.platform],
    ['Écran', `${v.screenWidth} × ${v.screenHeight}`],
    ['Viewport', `${v.viewportWidth} × ${v.viewportHeight}`],
    ['Pixel ratio', v.pixelRatio],
    ['Profondeur couleur', `${v.colorDepth} bit`],
    ['Mémoire appareil', v.deviceMemory != null ? `${v.deviceMemory} GB` : '—'],
    ['CPU (cœurs)', v.hardwareConcurrency ?? '—'],
    ['Points tactiles', v.touchPoints],
    ['Cookies activés', v.cookieEnabled ? 'Oui' : 'Non'],
    ['Do Not Track', v.doNotTrack ?? '—'],
    ['Type connexion', v.connectionType ?? '—'],
    ['Connexion effective', v.connectionEffectiveType ?? '—'],
    ['Débit (Mbps)', v.connectionDownlink ?? '—'],
    ['RTT (ms)', v.connectionRtt ?? '—'],
    ['Référent', v.referrer],
    ['Page visitée', v.url],
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4 bg-[#F5F5F7] dark:bg-[#2C2C2E] rounded-xl mt-1">
      {fields.map(([label, val]) => (
        <div key={label} className="bg-white dark:bg-[#1C1C1E] rounded-xl p-2.5">
          <div className="text-[10px] font-medium text-[#86868B] dark:text-[#636366] uppercase tracking-wide mb-0.5">{label}</div>
          <div className="text-[11px] text-[#1D1D1F] dark:text-[#F5F5F7] break-all">{String(val ?? '—')}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Row ─────────────────────────────────────────────────────────────────────

interface RowProps { visitor: VisitorData; index: number }
const Row: React.FC<RowProps> = ({ visitor: v, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="border-b border-black/[0.04] dark:border-white/[0.04] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] cursor-pointer transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <td className="px-3 py-2.5 text-[11px] text-[#86868B] dark:text-[#636366] font-mono">{index + 1}</td>
        <td className="px-3 py-2.5 text-[11px] text-[#1D1D1F] dark:text-[#F5F5F7] whitespace-nowrap">
          <div>{fmt(v.timestamp)}</div>
          <div className="text-[10px] text-[#86868B] dark:text-[#636366]">{ago(v.timestamp)} ago</div>
        </td>
        <td className="px-3 py-2.5 text-[11px] font-mono text-[#1D1D1F] dark:text-[#F5F5F7]">
          {v.ip ?? <span className="text-[#86868B] dark:text-[#636366]">—</span>}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-[#1D1D1F] dark:text-[#F5F5F7]">
          {v.country
            ? <span>{flag(v.countryCode)} {v.city ? `${v.city}, ` : ''}{v.country}</span>
            : <span className="text-[#86868B] dark:text-[#636366]">—</span>}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-[#1D1D1F] dark:text-[#F5F5F7]">
          <span className="inline-block px-2 py-0.5 rounded-full bg-[#E8F2FC] dark:bg-[#0A2540] text-[#0071E3] text-[10px] font-medium">
            {v.browser}
          </span>
        </td>
        <td className="px-3 py-2.5 text-[11px] text-[#6E6E73] dark:text-[#98989D]">{v.os}</td>
        <td className="px-3 py-2.5 text-[11px] text-[#6E6E73] dark:text-[#98989D]">{v.device}</td>
        <td className="px-3 py-2.5 text-[11px] text-[#6E6E73] dark:text-[#98989D] whitespace-nowrap">
          {v.screenWidth}×{v.screenHeight}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-[#6E6E73] dark:text-[#98989D]">{v.language}</td>
        <td className="px-3 py-2.5">
          <IconChevron open={open} />
        </td>
      </tr>
      {open && (
        <tr className="bg-transparent">
          <td colSpan={10} className="px-3 pb-3">
            <ExpandedRow visitor={v} />
          </td>
        </tr>
      )}
    </>
  );
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);

  const reload = () => setVisitors(getVisitors());

  useEffect(() => {
    reload();
    // Poll for new entries (IP geo enrichment happens async after page load)
    const id = setInterval(reload, 3000);
    return () => clearInterval(id);
  }, []);

  // Stats
  const uniqueIPs = useMemo(() => new Set(visitors.map(v => v.ip).filter(Boolean)).size, [visitors]);
  const uniqueCountries = useMemo(() => new Set(visitors.map(v => v.country).filter(Boolean)).size, [visitors]);
  const last24h = useMemo(() => {
    const cutoff = Date.now() - 86_400_000;
    return visitors.filter(v => new Date(v.timestamp).getTime() > cutoff).length;
  }, [visitors]);

  // Top lists
  const topCountries = useMemo(() => topN(visitors.map(v => v.countryCode && v.country ? `${v.countryCode} ${v.country}` : '').filter(Boolean)), [visitors]);
  const topBrowsers = useMemo(() => topN(visitors.map(v => v.browser)), [visitors]);
  const topOS = useMemo(() => topN(visitors.map(v => v.os)), [visitors]);
  const topDevices = useMemo(() => topN(visitors.map(v => v.device)), [visitors]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return visitors
      .filter(v =>
        !q ||
        v.ip?.includes(q) ||
        v.country?.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q) ||
        v.browser.toLowerCase().includes(q) ||
        v.os.toLowerCase().includes(q) ||
        v.userAgent.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        return sortDesc ? -diff : diff;
      });
  }, [visitors, search, sortDesc]);

  const handleClear = () => {
    if (confirmClear) {
      clearVisitors();
      reload();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] px-4 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">Dashboard visiteurs</h1>
            <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">
              Données collectées côté client · localStorage
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={reload}
              className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] text-[12px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-colors"
            >
              <IconRefresh />
              Actualiser
            </button>
            <button
              onClick={exportVisitorsAsJson}
              className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.08] text-[12px] font-medium text-[#0071E3] hover:bg-[#E8F2FC] dark:hover:bg-[#0A2540] transition-colors"
            >
              <IconDownload />
              Exporter JSON
            </button>
            <button
              onClick={handleClear}
              className={`h-8 px-3 flex items-center gap-1.5 rounded-lg border text-[12px] font-medium transition-colors ${
                confirmClear
                  ? 'bg-[#FF3B30] border-[#FF3B30] text-white'
                  : 'bg-white dark:bg-[#1C1C1E] border-black/[0.08] dark:border-white/[0.08] text-[#FF3B30] hover:bg-red-50 dark:hover:bg-[#2C2C2E]'
              }`}
            >
              <IconTrash />
              {confirmClear ? 'Confirmer ?' : 'Effacer tout'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Visites totales" value={visitors.length} sub="toutes sessions" icon={<IconActivity />} />
          <StatCard label="IPs uniques" value={uniqueIPs} sub="visiteurs distincts" icon={<IconUsers />} />
          <StatCard label="Pays" value={uniqueCountries} sub="pays détectés" icon={<IconGlobe />} />
          <StatCard label="Dernières 24h" value={last24h} sub="sessions récentes" icon={<IconMonitor />} />
        </div>

        {/* Bar charts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <BarList title="Top pays" items={topCountries.map(i => ({ key: i.key, count: i.count }))} total={visitors.length} emoji />
          <BarList title="Navigateurs" items={topBrowsers} total={visitors.length} />
          <BarList title="OS" items={topOS} total={visitors.length} />
          <BarList title="Appareils" items={topDevices} total={visitors.length} />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
            <input
              type="text"
              placeholder="Rechercher IP, pays, navigateur, OS…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 h-8 px-3 rounded-lg bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[12px] text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] dark:placeholder-[#636366] outline-none border-none focus:ring-1 focus:ring-[#0071E3]"
            />
            <button
              onClick={() => setSortDesc(d => !d)}
              className="h-8 px-3 rounded-lg bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D] hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] transition-colors whitespace-nowrap"
            >
              {sortDesc ? '↓ Plus récent' : '↑ Plus ancien'}
            </button>
            <span className="text-[11px] text-[#86868B] dark:text-[#636366] whitespace-nowrap">
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#86868B] dark:text-[#636366]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-[13px]">
                {visitors.length === 0
                  ? 'Aucun visiteur enregistré pour le moment'
                  : 'Aucun résultat pour cette recherche'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                    {['#', 'Date / Heure', 'IP', 'Localisation', 'Navigateur', 'OS', 'Appareil', 'Écran', 'Langue', ''].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#636366] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <Row key={v.id} visitor={v} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="mt-8 text-center text-[11px] text-[#86868B] dark:text-[#636366]">
          Données stockées localement · Aucune donnée envoyée vers un serveur
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
