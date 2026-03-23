import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';

import appLogo from '../assets/localShort/logo.png';
import screen1 from '../assets/localShort/screen1.PNG';
import screen2 from '../assets/localShort/screen2.PNG';
import screen3 from '../assets/localShort/screen3.PNG';

/* ─── Contact form ────────────────────────────────────────────── */
const CONTACT_EMAIL = 'VOTRE_EMAIL@exemple.com';

/* ─── Download sources ────────────────────────────────────────── */
const DOWNLOAD_SOURCES = [
  {
    name: 'SSS Instagram',
    url: 'https://sssinstagram.com/fr',
    icon: '📸',
    desc: { fr: 'Télécharger depuis Instagram & Facebook', en: 'Download from Instagram & Facebook' },
    color: '#E1306C',
  },
  {
    name: 'SaveFrom TikTok',
    url: 'https://fr.savefrom.net/136Yq/download-from-tiktok',
    icon: '🎵',
    desc: { fr: 'Télécharger depuis TikTok', en: 'Download from TikTok' },
    color: '#010101',
  },
  {
    name: 'SSSTik',
    url: 'https://ssstik.io/fr',
    icon: '⬇️',
    desc: { fr: 'Téléchargeur TikTok rapide & HD', en: 'Fast & HD TikTok downloader' },
    color: '#FE2C55',
  },
];

/* ─── UI strings ──────────────────────────────────────────────── */
const UI = {
  fr: {
    navFeatures: 'Fonctionnalités', navDownload: 'Télécharger', navContact: 'Contact', navBack: 'Retour',
    badge: 'Lecteur vidéo local',
    heroTitle: 'Vos Shorts.', heroAccent: 'En local.',
    heroSub: "LocalShort vous permet de consulter vos vidéos courtes (TikTok, Reels, Shorts) stockées localement sur votre appareil — sans connexion, sans algorithme, sans distraction.",
    ctaDownload: 'Télécharger des vidéos', ctaFeatures: 'Voir les fonctionnalités',
    stats: [{ value: '0', label: 'Connexion requise' }, { value: '100%', label: 'Vie privée' }, { value: '∞', label: 'Stockage local' }],
    featuresEyebrow: 'Pourquoi LocalShort', featuresTitle: 'Votre collection, vos règles.',
    featuresSub: "Regardez vos vidéos favorites sans dépendre d'internet ni d'un algorithme.",
    downloadEyebrow: 'Télécharger des vidéos', downloadTitle: 'Récupérez vos vidéos.',
    downloadSub: "Utilisez ces outils pour télécharger vos vidéos TikTok, Instagram et Reels, puis importez-les dans LocalShort.",
    downloadBtn: 'Ouvrir le site',
    screensEyebrow: 'Aperçu', screensTitle: "L'interface, fluide.",
    missionEyebrow: 'Notre mission',
    missionTitle: 'Votre contenu vous appartient.', missionAccent: 'Regardez-le où vous voulez.',
    missionText: "Les plateformes de vidéos courtes captent votre attention via des algorithmes addictifs. LocalShort vous redonne le contrôle : importez vos vidéos préférées et consultez-les à votre rythme, sans scroll infini ni recommandations intrusives.",
    legalEyebrow: 'Légal & Transparence', legalTitle: 'Documents officiels',
    contactEyebrow: 'Contact', contactTitle: 'Une question ?',
    contactSub: "Suggestion, bug report, partenariat — on vous répond.",
    formName: 'Nom', formEmail: 'Email', formSubject: 'Sujet', formMsg: 'Message',
    formNamePh: 'Votre nom', formSubjectPh: 'Suggestion, question, bug...', formMsgPh: 'Votre message...',
    formSend: 'Envoyer le message', formSending: 'Envoi en cours...',
    successTitle: 'Message envoyé !', successSub: 'On vous répondra dès que possible.',
    successBtn: 'Envoyer un autre message',
    errorMsg: "Une erreur est survenue. Réessayez ou contactez-nous directement.",
    footerCgu: 'CGU', footerPrivacy: 'Confidentialité', footerMentions: 'Mentions légales',
    footerRights: 'Tous droits réservés.',
  },
  en: {
    navFeatures: 'Features', navDownload: 'Download', navContact: 'Contact', navBack: 'Back',
    badge: 'Local video player',
    heroTitle: 'Your Shorts.', heroAccent: 'Offline.',
    heroSub: "LocalShort lets you browse your short-form videos (TikTok, Reels, Shorts) stored locally on your device — no internet, no algorithm, no distraction.",
    ctaDownload: 'Download videos', ctaFeatures: 'See features',
    stats: [{ value: '0', label: 'Connection needed' }, { value: '100%', label: 'Privacy' }, { value: '∞', label: 'Local storage' }],
    featuresEyebrow: 'Why LocalShort', featuresTitle: 'Your collection, your rules.',
    featuresSub: "Watch your favorite videos without relying on internet or an algorithm.",
    downloadEyebrow: 'Download videos', downloadTitle: 'Get your videos.',
    downloadSub: "Use these tools to download your TikTok, Instagram and Reels videos, then import them into LocalShort.",
    downloadBtn: 'Open site',
    screensEyebrow: 'Preview', screensTitle: 'Smooth interface.',
    missionEyebrow: 'Our mission',
    missionTitle: 'Your content belongs to you.', missionAccent: 'Watch it anywhere.',
    missionText: "Short-form video platforms capture your attention through addictive algorithms. LocalShort gives you back control: import your favorite videos and watch them at your own pace, without infinite scrolling or intrusive recommendations.",
    legalEyebrow: 'Legal & Transparency', legalTitle: 'Official documents',
    contactEyebrow: 'Contact', contactTitle: 'A question?',
    contactSub: "Suggestion, bug report, partnership — we'll get back to you.",
    formName: 'Name', formEmail: 'Email', formSubject: 'Subject', formMsg: 'Message',
    formNamePh: 'Your name', formSubjectPh: 'Suggestion, question, bug...', formMsgPh: 'Your message...',
    formSend: 'Send message', formSending: 'Sending...',
    successTitle: 'Message sent!', successSub: "We'll get back to you as soon as possible.",
    successBtn: 'Send another message',
    errorMsg: "An error occurred. Please try again or contact us directly.",
    footerCgu: 'TOS', footerPrivacy: 'Privacy', footerMentions: 'Legal notice',
    footerRights: 'All rights reserved.',
  },
};

/* ─── Features ────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '📴', title: { fr: 'Hors ligne total', en: 'Fully offline' }, desc: { fr: 'Regardez vos vidéos sans connexion internet. Avion, métro, partout.', en: 'Watch your videos without internet. Plane, subway, anywhere.' } },
  { icon: '🔒', title: { fr: 'Vie privée totale', en: 'Total privacy' }, desc: { fr: 'Aucune donnée transmise. Vos vidéos restent sur votre appareil.', en: 'No data sent. Your videos stay on your device.' } },
  { icon: '⚡', title: { fr: 'Lecture instantanée', en: 'Instant playback' }, desc: { fr: 'Interface fluide et rapide, optimisée pour les vidéos courtes.', en: 'Smooth and fast interface, optimized for short-form videos.' } },
  { icon: '📁', title: { fr: 'Import facile', en: 'Easy import' }, desc: { fr: 'Importez vos fichiers vidéo directement depuis votre galerie ou vos fichiers.', en: 'Import video files directly from your gallery or file manager.' } },
  { icon: '🎬', title: { fr: 'Lecture en boucle', en: 'Loop playback' }, desc: { fr: 'Rejouez vos vidéos préférées en continu sans manipulation.', en: 'Replay your favorites continuously without any extra steps.' } },
  { icon: '🚫', title: { fr: 'Zéro algorithme', en: 'Zero algorithm' }, desc: { fr: 'Vous choisissez ce que vous regardez. Pas de recommandations imposées.', en: 'You choose what you watch. No forced recommendations.' } },
];

/* ─── Legal sections ──────────────────────────────────────────── */
const LEGAL = {
  cgu: {
    title: { fr: "Conditions Générales d'Utilisation", en: 'Terms of Service' },
    content: {
      fr: `**Dernière mise à jour : mars 2026**

**1. Objet**
Les présentes CGU régissent l'utilisation de l'application mobile LocalShort.

**2. Accès à l'Application**
L'Application est accessible gratuitement. L'utilisateur s'engage à ne pas l'utiliser à des fins illicites et à ne stocker que des vidéos dont il détient les droits.

**3. Propriété intellectuelle**
L'ensemble des éléments constituant l'Application est la propriété exclusive du développeur. L'utilisateur est seul responsable du contenu qu'il importe.

**4. Limitation de responsabilité**
L'Application est fournie « en l'état ». Le développeur décline toute responsabilité quant au contenu importé par l'utilisateur.

**5. Modification des CGU**
Le développeur se réserve le droit de modifier les présentes CGU à tout moment.

**6. Droit applicable**
Les présentes CGU sont soumises au droit français.`,
      en: `**Last updated: March 2026**

**1. Purpose**
These Terms govern the use of the LocalShort mobile application.

**2. Access**
The app is free to use. Users agree not to use it for unlawful purposes and to only store videos they have rights to.

**3. Intellectual property**
All elements of the app are the exclusive property of the developer. The user is solely responsible for imported content.

**4. Limitation of liability**
The app is provided "as is". The developer disclaims all liability for user-imported content.

**5. Amendments**
The developer reserves the right to modify these terms at any time.

**6. Governing law**
These terms are governed by French law.`,
    },
  },
  privacy: {
    title: { fr: 'Politique de Confidentialité', en: 'Privacy Policy' },
    content: {
      fr: `**Dernière mise à jour : mars 2026**

**1. Collecte de données**
LocalShort ne collecte aucune donnée personnelle. Toutes les vidéos restent stockées localement sur votre appareil.

**2. Données techniques**
Aucune donnée n'est transmise à des serveurs tiers.

**3. Contenu utilisateur**
Vos vidéos importées ne quittent jamais votre appareil.

**4. Cookies et traceurs**
L'Application n'utilise aucun cookie ni traceur.

**5. Vos droits**
Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.`,
      en: `**Last updated: March 2026**

**1. Data collection**
LocalShort does not collect any personal data. All videos remain stored locally on your device.

**2. Technical data**
No data is transmitted to third-party servers.

**3. User content**
Your imported videos never leave your device.

**4. Cookies**
The app uses no cookies or trackers.

**5. Your rights**
Under GDPR, you have the right to access, rectify, and delete your data.`,
    },
  },
  mentions: {
    title: { fr: 'Mentions Légales', en: 'Legal Notice' },
    content: {
      fr: `**Éditeur de l'Application**
LocalShort est développée et éditée par un développeur indépendant.

**Hébergement**
Distribuée via l'App Store d'Apple Inc., One Apple Park Way, Cupertino, CA 95014, USA.

**Propriété intellectuelle**
Tous droits réservés. Toute reproduction est interdite sans autorisation préalable.

**Contenu tiers**
L'utilisateur est seul responsable des vidéos importées dans l'application.

**Contact**
Utilisez le formulaire de contact disponible sur cette page.`,
      en: `**Publisher**
LocalShort is developed and published by an independent developer.

**Hosting**
Distributed via Apple Inc. App Store, One Apple Park Way, Cupertino, CA 95014, USA.

**Intellectual property**
All rights reserved. Any reproduction is prohibited without prior authorization.

**Third-party content**
The user is solely responsible for videos imported into the application.

**Contact**
Use the contact form available on this page.`,
    },
  },
};

/* ─── Markdown renderer ───────────────────────────────────────── */
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-sm text-[#6E6E73] dark:text-white/70 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && line.length > 4 && !line.slice(2, -2).includes('**')) {
          return <p key={i} className="font-bold text-[#1D1D1F] dark:text-white mt-4 first:mt-0">{line.slice(2, -2)}</p>;
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>{parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} className="text-[#1D1D1F] dark:text-white font-semibold">{part.slice(2, -2)}</strong>
              : part
          )}</p>
        );
      })}
    </div>
  );
};

/* ─── Page ────────────────────────────────────────────────────── */
const LocalShortLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, toggleLang } = useLang();
  const ui = UI[lang];
  const [activeLegal, setActiveLegal] = useState<'cgu' | 'privacy' | 'mentions' | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const contactRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const downloadRef = useRef<HTMLElement>(null);

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
          subject: formState.subject || 'Contact LocalShort',
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
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0A0A0F] text-[#1D1D1F] dark:text-white overflow-x-hidden transition-colors duration-300">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F5F7]/80 dark:bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={appLogo} alt="LocalShort" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold tracking-tight text-[#1D1D1F] dark:text-white">
              Local<span className="text-[#8B5CF6]">Short</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#6E6E73] dark:text-white/60">
            <button onClick={() => scrollTo(featuresRef)} className="hover:text-white transition-colors">{ui.navFeatures}</button>
            <button onClick={() => scrollTo(downloadRef)} className="hover:text-white transition-colors">{ui.navDownload}</button>
            <button onClick={() => setActiveLegal('cgu')} className="hover:text-white transition-colors">CGU</button>
            <button onClick={() => scrollTo(contactRef)} className="hover:text-white transition-colors">{ui.navContact}</button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="h-7 px-2.5 rounded-md text-[11px] font-bold text-[#6E6E73] dark:text-white/50 hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.08] transition-colors uppercase tracking-wider border border-black/[0.10] dark:border-white/[0.10]"
              aria-label="Toggle language"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button
              onClick={() => navigate('/portefolio')}
              className="text-xs text-[#86868B] dark:text-white/40 hover:text-white/80 transition-colors flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              {ui.navBack}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#8B5CF6]/10 blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#A78BFA]/5 blur-[80px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-[#6D28D9]/8 blur-[100px]" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#8B5CF6]/30 rounded-[28px] blur-2xl scale-110" />
              <img src={appLogo} alt="LocalShort" className="relative w-28 h-28 rounded-[28px] shadow-2xl object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#A78BFA] text-xs font-semibold mb-6 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
              {ui.badge}
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none"
          >
            {ui.heroTitle}{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
              {ui.heroAccent}
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-[#6E6E73] dark:text-white/50 max-w-xl mx-auto leading-relaxed mb-10"
          >
            {ui.heroSub}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={() => scrollTo(downloadRef)}
              className="px-8 py-4 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-base transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-[#8B5CF6]/30">
              {ui.ctaDownload}
            </button>
            <button onClick={() => scrollTo(featuresRef)}
              className="px-8 py-4 rounded-2xl bg-black/[0.06] dark:bg-white/[0.06] hover:bg-black/[0.10] dark:hover:bg-white/[0.10] border border-black/10 dark:border-white/10 text-[#1D1D1F] dark:text-white font-medium text-base transition-all duration-200">
              {ui.ctaFeatures}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Download Sources (prominent, right after hero) ──────── */}
      <section ref={downloadRef} className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/10 via-[#8B5CF6]/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA] text-xs font-bold mb-4 tracking-widest uppercase">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {ui.downloadEyebrow}
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1D1D1F] dark:text-white mb-2">{ui.downloadTitle}</h2>
            <p className="text-[#86868B] dark:text-white/40 text-sm max-w-md mx-auto">{ui.downloadSub}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DOWNLOAD_SOURCES.map((src, i) => (
              <motion.a
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="group relative flex flex-col items-center text-center p-7 rounded-2xl border-2 border-[#8B5CF6]/40 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/80 transition-all duration-250 cursor-pointer shadow-lg shadow-[#8B5CF6]/10 hover:shadow-[#8B5CF6]/25"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#8B5CF6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{src.icon}</div>
                  <h3 className="text-lg font-black text-[#1D1D1F] dark:text-white mb-2 tracking-tight">{src.name}</h3>
                  <p className="text-sm text-[#1D1D1F] dark:text-white/55 leading-relaxed mb-6">{src.desc[lang]}</p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] text-white text-sm font-bold group-hover:bg-[#7C3AED] transition-colors shadow-md shadow-[#8B5CF6]/30">
                    {ui.downloadBtn}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          {ui.stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-black text-[#8B5CF6] mb-1">{s.value}</div>
              <div className="text-sm text-[#86868B] dark:text-white/40 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section ref={featuresRef} className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-3">{ui.featuresEyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{ui.featuresTitle}</h2>
          <p className="text-[#86868B] dark:text-white/40 mt-4 max-w-lg mx-auto">{ui.featuresSub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title.fr}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-6 hover:bg-black/[0.06] dark:hover:bg-white/[0.06] hover:border-[#8B5CF6]/30 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-base font-bold text-[#1D1D1F] dark:text-white mb-2">{f.title[lang]}</h3>
              <p className="text-sm text-[#6E6E73] dark:text-white/50 leading-relaxed">{f.desc[lang]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Screenshots ────────────────────────────────────────── */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-3">{ui.screensEyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{ui.screensTitle}</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide px-8 pb-4 justify-center">
          {[screen1, screen2, screen3].map((src, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
              className="flex-shrink-0 relative"
            >
              <div className="absolute inset-0 bg-[#8B5CF6]/10 rounded-[32px] blur-2xl scale-95" />
              <img src={src} alt={`Screenshot ${i + 1}`}
                className="relative h-[520px] w-auto rounded-[28px] shadow-2xl border border-black/[0.08] dark:border-white/[0.08] object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-4">{ui.missionEyebrow}</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              {ui.missionTitle}<br />
              <span className="text-[#8B5CF6]">{ui.missionAccent}</span>
            </h2>
            <p className="text-[#6E6E73] dark:text-white/50 leading-relaxed max-w-md">{ui.missionText}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="flex-shrink-0"
          >
            <div className="relative w-64 md:w-72">
              <div className="absolute inset-0 bg-[#8B5CF6]/20 rounded-3xl blur-3xl" />
              <img src={screen2} alt="LocalShort app" className="relative rounded-3xl shadow-2xl border border-black/[0.08] dark:border-white/[0.08] object-cover w-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Legal ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-3">{ui.legalEyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">{ui.legalTitle}</h2>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {(Object.keys(LEGAL) as Array<keyof typeof LEGAL>).map((key) => (
            <button key={key}
              onClick={() => setActiveLegal(activeLegal === key ? null : key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${activeLegal === key
                ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                : 'bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] text-[#6E6E73] dark:text-white/60 hover:text-white hover:border-black/20 dark:hover:border-white/20'}`}
            >
              {LEGAL[key].title[lang]}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {activeLegal && (
            <motion.div key={activeLegal}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-6 md:p-8"
            >
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white mb-5">{LEGAL[activeLegal].title[lang]}</h3>
              <SimpleMarkdown text={LEGAL[activeLegal].content[lang]} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section ref={contactRef} className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#8B5CF6] mb-3">{ui.contactEyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{ui.contactTitle}</h2>
          <p className="text-[#86868B] dark:text-white/40 text-sm">{ui.contactSub}</p>
        </div>
        <div className="bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-3xl p-6 md:p-8">
          {formStatus === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white mb-2">{ui.successTitle}</h3>
              <p className="text-[#86868B] dark:text-white/40 text-sm">{ui.successSub}</p>
              <button onClick={() => setFormStatus('idle')}
                className="mt-6 px-6 py-2.5 rounded-xl bg-black/[0.06] dark:bg-white/[0.06] border border-black/[0.10] dark:border-white/[0.10] text-[#1D1D1F] dark:text-white text-sm hover:bg-black/[0.10] dark:hover:bg-white/[0.10] transition-colors">
                {ui.successBtn}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#86868B] dark:text-white/40 mb-1.5 uppercase tracking-wider">{ui.formName}</label>
                  <input type="text" required value={formState.name}
                    onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                    placeholder={ui.formNamePh}
                    className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868B] dark:text-white/40 mb-1.5 uppercase tracking-wider">{ui.formEmail}</label>
                  <input type="email" required value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    placeholder="votre@email.com"
                    className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#86868B] dark:text-white/40 mb-1.5 uppercase tracking-wider">{ui.formSubject}</label>
                <input type="text" value={formState.subject}
                  onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                  placeholder={ui.formSubjectPh}
                  className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#86868B] dark:text-white/40 mb-1.5 uppercase tracking-wider">{ui.formMsg}</label>
                <textarea required rows={5} value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  placeholder={ui.formMsgPh}
                  className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all resize-none" />
              </div>
              {formStatus === 'error' && <p className="text-sm text-red-400">{ui.errorMsg}</p>}
              <button type="submit" disabled={formStatus === 'sending'}
                className="w-full py-4 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-bold text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#8B5CF6]/20">
                {formStatus === 'sending' ? ui.formSending : ui.formSend}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#86868B] dark:text-white/30">
          <div className="flex items-center gap-2">
            <img src={appLogo} alt="" className="w-6 h-6 rounded-md object-cover" />
            <span>Local<span className="text-[#8B5CF6]/60">Short</span></span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setActiveLegal('cgu')} className="hover:text-[#6E6E73] dark:text-white/60 transition-colors">{ui.footerCgu}</button>
            <button onClick={() => setActiveLegal('privacy')} className="hover:text-[#6E6E73] dark:text-white/60 transition-colors">{ui.footerPrivacy}</button>
            <button onClick={() => setActiveLegal('mentions')} className="hover:text-[#6E6E73] dark:text-white/60 transition-colors">{ui.footerMentions}</button>
          </div>
          <span>© {new Date().getFullYear()} LocalShort. {ui.footerRights}</span>
        </div>
      </footer>
    </div>
  );
};

export default LocalShortLandingPage;
