import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import appLogo from '../assets/meowTube/appLogo.png';
import appHome from '../assets/meowTube/AppHomePage.png';
import appSecond from '../assets/meowTube/AppSecondPage.png';
import redCat from '../assets/meowTube/Red Cat Illustration.png';
import redDecoration from '../assets/meowTube/redCatDecoration.png';

/* ─── Contact form – uses FormSubmit.co AJAX endpoint ─────────────
   Replace the placeholder email below with your personal address.
   FormSubmit will send you an email the first time and ask to confirm.
   ──────────────────────────────────────────────────────────────── */
const CONTACT_EMAIL = 'VOTRE_EMAIL@exemple.com'; // TODO: remplace par ton adresse

/* ─── Legal sections ──────────────────────────────────────────── */
const LEGAL = {
  cgu: {
    title: 'Conditions Générales d\'Utilisation',
    content: `**Dernière mise à jour : mars 2026**

**1. Objet**
Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de l'application mobile Meow-Toob (ci-après « l'Application »).

**2. Accès à l'Application**
L'Application est accessible gratuitement. L'utilisateur s'engage à ne pas utiliser l'Application à des fins illicites ou contraires aux présentes CGU.

**3. Propriété intellectuelle**
L'ensemble des éléments constituant l'Application (logo, interface, code source, design) est la propriété exclusive du développeur et est protégé par les lois relatives à la propriété intellectuelle.

**4. Limitation de responsabilité**
L'Application est fournie « en l'état », sans garantie d'aucune sorte. Le développeur ne saurait être tenu responsable de tout dommage direct ou indirect résultant de l'utilisation de l'Application.

**5. Modification des CGU**
Le développeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification par notification dans l'Application.

**6. Droit applicable**
Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation relève de la compétence des tribunaux français.`,
  },
  privacy: {
    title: 'Politique de Confidentialité',
    content: `**Dernière mise à jour : mars 2026**

**1. Collecte de données**
Meow-Toob ne collecte aucune donnée personnelle à des fins publicitaires ou de profilage. L'Application ne suit pas le temps passé à l'écran et ne transmet aucune donnée à des tiers à des fins commerciales.

**2. Données techniques**
Des données techniques anonymisées peuvent être collectées pour améliorer les performances de l'Application (logs d'erreurs, statistiques d'utilisation anonymes).

**3. Données de connexion**
Si vous utilisez un compte pour accéder à des services vidéo, vos identifiants sont traités directement par les fournisseurs concernés et ne transitent pas par nos serveurs.

**4. Cookies et traceurs**
L'Application n'utilise pas de cookies à des fins de ciblage publicitaire.

**5. Vos droits**
Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous via le formulaire de contact.

**6. Contact DPO**
Pour toute question relative à vos données personnelles, utilisez le formulaire de contact disponible sur cette page.`,
  },
  mentions: {
    title: 'Mentions Légales',
    content: `**Éditeur de l'Application**
Meow-Toob est une application développée et éditée par un développeur indépendant.

**Hébergement**
L'Application est distribuée via l'App Store d'Apple Inc., One Apple Park Way, Cupertino, CA 95014, États-Unis.

**Propriété intellectuelle**
Tous les droits de propriété intellectuelle sur l'Application et son contenu sont réservés. Toute reproduction, même partielle, est interdite sans autorisation préalable.

**Responsabilité**
Le développeur s'efforce d'assurer l'exactitude et la mise à jour des informations disponibles sur l'Application. Cependant, il ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées.

**Liens externes**
L'Application peut contenir des liens vers des sites externes. Ces liens sont fournis à titre informatif uniquement. Le développeur n'est pas responsable du contenu de ces sites.

**Contact**
Pour toute question, utilisez le formulaire de contact disponible sur cette page.`,
  },
};

/* ─── Feature cards data ──────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🚫',
    title: 'Zéro publicité',
    desc: 'Regardez ce qui vous intéresse sans interruption. Aucune pub, jamais.',
  },
  {
    icon: '⏱️',
    title: 'Sans timer intrusif',
    desc: 'Votre temps vous appartient. Pas de notification culpabilisante.',
  },
  {
    icon: '📵',
    title: 'Adieu les Shorts',
    desc: 'Fini le scroll infini de vidéos courtes. Du contenu long, de qualité.',
  },
  {
    icon: '🧠',
    title: 'Axé productivité',
    desc: 'Interface pensée pour rester concentré sur ce qui compte vraiment.',
  },
  {
    icon: '🎯',
    title: 'Contenu ciblé',
    desc: 'Trouvez rapidement les vidéos qui enrichissent votre quotidien.',
  },
  {
    icon: '🔒',
    title: 'Vie privée respectée',
    desc: 'Aucun profil publicitaire. Aucune donnée vendue à des tiers.',
  },
];

/* ─── Markdown renderer (minimal) ────────────────────────────── */
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-sm text-white/70 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && line.length > 4 && !line.slice(2, -2).includes('**')) {
          return <p key={i} className="font-bold text-white mt-4 first:mt-0">{line.slice(2, -2)}</p>;
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>{parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
              : part
          )}</p>
        );
      })}
    </div>
  );
};

/* ─── Page ────────────────────────────────────────────────────── */
const MeowTubeLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeLegal, setActiveLegal] = useState<'cgu' | 'privacy' | 'mentions' | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const contactRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.subject || 'Contact Meow-Toob',
          message: formState.message,
        }),
      });
      if (res.ok) {
        setFormStatus('success');
        setFormState({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={appLogo} alt="Meow-Toob" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold tracking-tight text-white">
              Meow<span className="text-[#E60000]">-Toob</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <button onClick={() => scrollTo(featuresRef)} className="hover:text-white transition-colors">Fonctionnalités</button>
            <button onClick={() => setActiveLegal('cgu')} className="hover:text-white transition-colors">CGU</button>
            <button onClick={() => scrollTo(contactRef)} className="hover:text-white transition-colors">Contact</button>
          </div>
          <button
            onClick={() => navigate('/portefolio')}
            className="text-xs text-white/40 hover:text-white/80 transition-colors flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            Retour
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#E60000]/10 blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#FF4444]/5 blur-[80px]" />
        </div>

        {/* Red cat decoration */}
        <img src={redDecoration} alt="" aria-hidden
          className="absolute right-0 bottom-0 w-72 md:w-96 opacity-20 pointer-events-none select-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#E60000]/30 rounded-[28px] blur-2xl scale-110" />
              <img src={appLogo} alt="Meow-Toob" className="relative w-28 h-28 rounded-[28px] shadow-2xl" />
            </div>
          </motion.div>

          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E60000]/10 border border-[#E60000]/20 text-[#FF4444] text-xs font-semibold mb-6 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E60000] animate-pulse" />
              Bientôt disponible
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none"
          >
            Regardez.{' '}
            <span className="bg-gradient-to-r from-[#E60000] to-[#FF6B6B] bg-clip-text text-transparent">
              Sans dérive.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed mb-10"
          >
            Meow-Toob vous donne accès à du contenu vidéo de qualité —
            sans publicités, sans Shorts, sans chronomètre.
            Juste ce que vous voulez regarder.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollTo(contactRef)}
              className="px-8 py-4 rounded-2xl bg-[#E60000] hover:bg-[#CC0000] text-white font-bold text-base transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-[#E60000]/30">
              Rejoindre la bêta
            </button>
            <button
              onClick={() => scrollTo(featuresRef)}
              className="px-8 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 text-white font-medium text-base transition-all duration-200">
              Voir les fonctionnalités
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Stats band ─────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '0', label: 'Publicités' },
            { value: '0', label: 'Shorts / Reels' },
            { value: '∞', label: 'Productivité' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-black text-[#E60000] mb-1">{s.value}</div>
              <div className="text-sm text-white/40 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section ref={featuresRef} className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E60000] mb-3">Pourquoi Meow-Toob</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Conçu pour votre attention.</h2>
          <p className="text-white/40 mt-4 max-w-lg mx-auto">Chaque fonctionnalité est pensée pour vous garder dans le flux, pas pour vous y piéger.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-[#E60000]/30 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Screenshots ────────────────────────────────────────── */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E60000] mb-3">Aperçu</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">L'interface, simple.</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide px-8 pb-4 justify-center">
          {[appHome, appSecond].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
              className="flex-shrink-0 relative"
            >
              <div className="absolute inset-0 bg-[#E60000]/10 rounded-[32px] blur-2xl scale-95" />
              <img
                src={src}
                alt={`Screenshot ${i + 1}`}
                className="relative h-[520px] w-auto rounded-[28px] shadow-2xl border border-white/[0.08] object-cover"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Cat section ────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E60000]/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E60000] mb-4">Notre mission</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              La vidéo devrait<br />
              <span className="text-[#E60000]">vous servir.</span><br />
              Pas l'inverse.
            </h2>
            <p className="text-white/50 leading-relaxed max-w-md">
              Les plateformes vidéo actuelles sont conçues pour maximiser votre temps d'écran. Meow-Toob renverse cette logique : vous regardez ce que vous voulez, quand vous voulez, sans algorithme qui vous retient.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="flex-shrink-0"
          >
            <img src={redCat} alt="Meow-Toob mascot" className="w-64 md:w-80 drop-shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* ── Legal ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E60000] mb-3">Légal & Transparence</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Documents officiels</h2>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {(Object.keys(LEGAL) as Array<keyof typeof LEGAL>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveLegal(activeLegal === key ? null : key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${activeLegal === key
                ? 'bg-[#E60000] border-[#E60000] text-white'
                : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white hover:border-white/20'}`}
            >
              {LEGAL[key].title.replace('Conditions Générales d\'Utilisation', 'CGU')}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {activeLegal && (
            <motion.div
              key={activeLegal}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8"
            >
              <h3 className="text-lg font-bold text-white mb-5">{LEGAL[activeLegal].title}</h3>
              <SimpleMarkdown text={LEGAL[activeLegal].content} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section ref={contactRef} className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E60000] mb-3">Contact</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Une question ?</h2>
          <p className="text-white/40 text-sm">Bêta, partenariat, bug report — on vous répond.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 md:p-8">
          {formStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-white mb-2">Message envoyé !</h3>
              <p className="text-white/40 text-sm">On vous répondra dès que possible.</p>
              <button
                onClick={() => setFormStatus('idle')}
                className="mt-6 px-6 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white text-sm hover:bg-white/[0.10] transition-colors">
                Envoyer un autre message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Nom</label>
                  <input
                    type="text" required
                    value={formState.name}
                    onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                    placeholder="Votre nom"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E60000]/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
                  <input
                    type="email" required
                    value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    placeholder="votre@email.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E60000]/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Sujet</label>
                <input
                  type="text"
                  value={formState.subject}
                  onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                  placeholder="Bêta, question, partenariat..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E60000]/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Message</label>
                <textarea
                  required rows={5}
                  value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  placeholder="Votre message..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#E60000]/50 focus:bg-white/[0.06] transition-all resize-none"
                />
              </div>
              {formStatus === 'error' && (
                <p className="text-sm text-red-400">Une erreur est survenue. Réessayez ou contactez-nous directement.</p>
              )}
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full py-4 rounded-xl bg-[#E60000] hover:bg-[#CC0000] disabled:opacity-50 text-white font-bold text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#E60000]/20"
              >
                {formStatus === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <img src={appLogo} alt="" className="w-6 h-6 rounded-md" />
            <span>Meow<span className="text-[#E60000]/60">-Toob</span></span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setActiveLegal('cgu')} className="hover:text-white/60 transition-colors">CGU</button>
            <button onClick={() => setActiveLegal('privacy')} className="hover:text-white/60 transition-colors">Confidentialité</button>
            <button onClick={() => setActiveLegal('mentions')} className="hover:text-white/60 transition-colors">Mentions légales</button>
          </div>
          <span>© {new Date().getFullYear()} Meow-Toob. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
};

export default MeowTubeLandingPage;
