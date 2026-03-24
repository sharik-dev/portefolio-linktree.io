import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../contexts/LangContext';

import appLogo from '../assets/islamic daily quote/logo.png';
import firstImage from '../assets/islamic daily quote/firstImage.png';
import appImage from '../assets/islamic daily quote/image.png';
import secondImage from '../assets/islamic daily quote/second image.png';
import thirdImage from '../assets/islamic daily quote/thirst image.png';
import TabletViewer from '../components/TabletViewer';

/* ─── Contact form ────────────────────────────────────────────── */
const CONTACT_EMAIL = 'VOTRE_EMAIL@exemple.com'; // TODO: remplace par ton adresse

/* ─── UI strings ──────────────────────────────────────────────── */
const UI = {
  fr: {
    navFeatures: 'Fonctionnalités', navQuotes: 'Citations', navContact: 'Contact', navBack: 'Retour',
    badge: 'Disponible sur AppStore',
    heroTitle: 'Nourris ton', heroAccent: 'cœur.', heroTitle2: 'Chaque jour.',
    heroSub: "Une citation islamique authentique chaque jour — hadith du Prophète ﷺ, versets coraniques réconfortants, paroles de sagesse pour illuminer votre quotidien.",
    ctaBeta: 'Rejoindre la bêta', ctaFeatures: 'Voir les fonctionnalités',
    stats: [{ value: '100+', label: 'Citations vérifiées' }, { value: '2', label: 'Langues (AR / FR)' }, { value: '∞', label: 'Sérénité' }],
    quotesEyebrow: 'Paroles de sagesse', quotesTitle: 'La citation du jour',
    quotesSub: 'Des paroles authentiques pour guider chaque instant de votre vie.',
    featuresEyebrow: 'Pourquoi Islamic Daily Quote', featuresTitle: "Conçu pour l'âme.",
    featuresSub: "Chaque fonctionnalité est pensée pour enrichir votre quotidien spirituel.",
    screensEyebrow: 'Aperçu', screensTitle: "L'expérience, épurée.",
    missionEyebrow: 'Notre mission',
    missionTitle: 'La sagesse islamique,', missionAccent: 'à portée de main.',
    missionText: "Dans un monde connecté et souvent agité, nous voulons offrir un espace de sérénité — un instant quotidien pour se reconnecter à sa foi, puiser dans la sagesse du Prophète ﷺ et des versets coraniques, et repartir avec le cœur apaisé.",
    missionVerse: '« Certes, c\'est par le rappel d\'Allah que les cœurs se tranquillisent. »',
    missionVerseSource: '— Coran, Ar-Ra\'d (13:28)',
    legalEyebrow: 'Légal & Transparence', legalTitle: 'Documents officiels',
    contactEyebrow: 'Contact', contactTitle: 'Une question ?',
    contactSub: "Bêta, suggestion de citation, partenariat — on vous répond.",
    formName: 'Nom', formEmail: 'Email', formSubject: 'Sujet', formMsg: 'Message',
    formNamePh: 'Votre nom', formSubjectPh: 'Bêta, suggestion, question...', formMsgPh: 'Votre message...',
    formSend: 'Envoyer le message', formSending: 'Envoi en cours...',
    successTitle: 'Message envoyé !', successSub: 'On vous répondra dès que possible. Jazakallahu khayran.',
    successBtn: 'Envoyer un autre message',
    errorMsg: "Une erreur est survenue. Réessayez ou contactez-nous directement.",
    footerCgu: 'CGU', footerPrivacy: 'Confidentialité', footerMentions: 'Mentions légales',
    footerRights: 'Tous droits réservés.',
  },
  en: {
    navFeatures: 'Features', navQuotes: 'Quotes', navContact: 'Contact', navBack: 'Back',
    badge: 'Available on AppStore',
    heroTitle: 'Nourish your', heroAccent: 'heart.', heroTitle2: 'Every day.',
    heroSub: "An authentic Islamic quote every day — hadith of the Prophet ﷺ, comforting Quranic verses, words of wisdom to illuminate your daily life.",
    ctaBeta: 'Join the beta', ctaFeatures: 'See features',
    stats: [{ value: '100+', label: 'Verified quotes' }, { value: '2', label: 'Languages (AR / EN)' }, { value: '∞', label: 'Serenity' }],
    quotesEyebrow: 'Words of wisdom', quotesTitle: 'Quote of the day',
    quotesSub: 'Authentic words to guide every moment of your life.',
    featuresEyebrow: 'Why Islamic Daily Quote', featuresTitle: 'Built for the soul.',
    featuresSub: "Every feature is designed to enrich your daily spiritual life.",
    screensEyebrow: 'Preview', screensTitle: 'Pure experience.',
    missionEyebrow: 'Our mission',
    missionTitle: 'Islamic wisdom,', missionAccent: 'at your fingertips.',
    missionText: "In a connected and often hectic world, we want to offer a space of serenity — a daily moment to reconnect with your faith, draw from the wisdom of the Prophet ﷺ and Quranic verses, and move forward with a peaceful heart.",
    missionVerse: '"Verily, it is in the remembrance of Allah that hearts find rest."',
    missionVerseSource: '— Quran, Ar-Ra\'d (13:28)',
    legalEyebrow: 'Legal & Transparency', legalTitle: 'Official documents',
    contactEyebrow: 'Contact', contactTitle: 'A question?',
    contactSub: "Beta, quote suggestion, partnership — we'll get back to you.",
    formName: 'Name', formEmail: 'Email', formSubject: 'Subject', formMsg: 'Message',
    formNamePh: 'Your name', formSubjectPh: 'Beta, suggestion, question...', formMsgPh: 'Your message...',
    formSend: 'Send message', formSending: 'Sending...',
    successTitle: 'Message sent!', successSub: "We'll get back to you as soon as possible. Jazakallahu khayran.",
    successBtn: 'Send another message',
    errorMsg: "An error occurred. Please try again or contact us directly.",
    footerCgu: 'TOS', footerPrivacy: 'Privacy', footerMentions: 'Legal notice',
    footerRights: 'All rights reserved.',
  },
};

/* ─── Hadith & citations ──────────────────────────────────────── */
const QUOTES = [
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    text: { fr: 'Car avec la difficulté vient la facilité.', en: 'For indeed, with hardship comes ease.' },
    source: { fr: 'Coran, Sourate Al-Inshirah (94:6)', en: 'Quran, Surah Al-Inshirah (94:6)' },
    category: { fr: 'Coran', en: 'Quran' },
  },
  {
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    text: { fr: "Allah ne charge aucune âme au-delà de sa capacité.", en: 'Allah does not burden a soul beyond that it can bear.' },
    source: { fr: 'Coran, Sourate Al-Baqara (2:286)', en: 'Quran, Surah Al-Baqara (2:286)' },
    category: { fr: 'Coran', en: 'Quran' },
  },
  {
    arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    text: { fr: 'Le meilleur des hommes est celui qui est le plus utile aux autres.', en: 'The best of people are those who are most beneficial to others.' },
    source: { fr: 'Hadith – Rapporté par Al-Bayhaqi', en: 'Hadith – Reported by Al-Bayhaqi' },
    category: { fr: 'Hadith', en: 'Hadith' },
  },
  {
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    text: { fr: 'Certes, Allah est avec les patients.', en: 'Indeed, Allah is with the patient.' },
    source: { fr: 'Coran, Sourate Al-Baqara (2:153)', en: 'Quran, Surah Al-Baqara (2:153)' },
    category: { fr: 'Coran', en: 'Quran' },
  },
  {
    arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    text: { fr: "Le croyant fort est meilleur et plus aimé d'Allah que le croyant faible.", en: 'The strong believer is better and more beloved to Allah than the weak believer.' },
    source: { fr: 'Hadith – Sahih Muslim', en: 'Hadith – Sahih Muslim' },
    category: { fr: 'Hadith', en: 'Hadith' },
  },
  {
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ',
    text: { fr: 'Ton sourire à ton frère est une aumône.', en: 'Your smile to your brother is a charity.' },
    source: { fr: 'Hadith – Rapporté par At-Tirmidhi', en: 'Hadith – Reported by At-Tirmidhi' },
    category: { fr: 'Hadith', en: 'Hadith' },
  },
  {
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    text: { fr: 'Celui qui craint Allah, Il lui ménagera une issue favorable.', en: 'Whoever fears Allah, He will make for him a way out.' },
    source: { fr: 'Coran, Sourate At-Talaq (65:2)', en: 'Quran, Surah At-Talaq (65:2)' },
    category: { fr: 'Coran', en: 'Quran' },
  },
  {
    arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    text: { fr: 'Certes, Allah ne laisse pas perdre la récompense de ceux qui font le bien.', en: 'Indeed, Allah does not waste the reward of the good-doers.' },
    source: { fr: 'Coran, Sourate At-Tawba (9:120)', en: 'Quran, Surah At-Tawba (9:120)' },
    category: { fr: 'Coran', en: 'Quran' },
  },
];

/* ─── Features ────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '📖', title: { fr: 'Citation du jour', en: 'Quote of the day' }, desc: { fr: 'Une parole spirituelle chaque jour pour commencer votre journée avec foi et sérénité.', en: 'A spiritual quote every day to start your morning with faith and serenity.' } },
  { icon: '🌙', title: { fr: 'Hadith authentiques', en: 'Authentic hadith' }, desc: { fr: 'Des hadiths vérifiés et sourcés, issus des recueils les plus fiables de la tradition.', en: 'Verified and sourced hadith, drawn from the most reliable classical collections.' } },
  { icon: '💚', title: { fr: 'Versets coraniques', en: 'Quranic verses' }, desc: { fr: 'Des versets réconfortants avec leur traduction en français pour nourrir votre cœur.', en: 'Comforting verses with their translation to nourish your heart.' } },
  { icon: '🔔', title: { fr: 'Rappel quotidien', en: 'Daily reminder' }, desc: { fr: 'Configurez une notification douce pour ne jamais manquer votre rappel spirituel.', en: 'Set a gentle notification so you never miss your daily spiritual reminder.' } },
  { icon: '🌍', title: { fr: 'Bilingue Arabe / FR', en: 'Bilingual Arabic / EN' }, desc: { fr: "Chaque citation s'affiche en arabe avec sa translittération et traduction française.", en: 'Every quote displays in Arabic with transliteration and English translation.' } },
  { icon: '🤍', title: { fr: 'Favoris & partage', en: 'Favorites & sharing' }, desc: { fr: 'Sauvegardez les citations qui vous touchent et partagez-les avec vos proches.', en: 'Save the quotes that move you and share them easily with your loved ones.' } },
];

/* ─── Legal ───────────────────────────────────────────────────── */
const LEGAL = {
  cgu: {
    title: { fr: "Conditions Générales d'Utilisation", en: 'Terms of Service' },
    content: {
      fr: `**Dernière mise à jour : mars 2026**

**1. Objet**
Les présentes CGU régissent l'utilisation de l'application mobile Islamic Daily Quote.

**2. Accès à l'Application**
L'Application est accessible gratuitement. L'utilisateur s'engage à ne pas l'utiliser à des fins illicites.

**3. Propriété intellectuelle**
L'ensemble des éléments constituant l'Application est la propriété exclusive du développeur.

**4. Contenu religieux**
Le contenu spirituel est sélectionné avec soin à partir de sources reconnues. L'Application décline toute responsabilité quant à une interprétation erronée du contenu.

**5. Limitation de responsabilité**
L'Application est fournie « en l'état », sans garantie d'aucune sorte.

**6. Droit applicable**
Les présentes CGU sont soumises au droit français.`,
      en: `**Last updated: March 2026**

**1. Purpose**
These Terms govern the use of the Islamic Daily Quote mobile application.

**2. Access**
The app is free to use. Users agree not to use it for unlawful purposes.

**3. Intellectual property**
All elements of the app are the exclusive property of the developer.

**4. Religious content**
Spiritual content is carefully selected from recognized sources. The app disclaims responsibility for any misinterpretation of content.

**5. Limitation of liability**
The app is provided "as is", without warranty of any kind.

**6. Governing law**
These terms are governed by French law.`,
    },
  },
  privacy: {
    title: { fr: 'Politique de Confidentialité', en: 'Privacy Policy' },
    content: {
      fr: `**Dernière mise à jour : mars 2026**

**1. Collecte de données**
Islamic Daily Quote ne collecte aucune donnée personnelle à des fins publicitaires ou de profilage.

**2. Données techniques**
Des données techniques anonymisées peuvent être collectées pour améliorer les performances.

**3. Notifications**
Si vous activez les notifications, aucune donnée personnelle n'est transmise à des tiers.

**4. Cookies et traceurs**
L'Application n'utilise pas de cookies à des fins de ciblage publicitaire.

**5. Vos droits**
Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression.`,
      en: `**Last updated: March 2026**

**1. Data collection**
Islamic Daily Quote does not collect personal data for advertising or profiling.

**2. Technical data**
Anonymized technical data may be collected to improve performance.

**3. Notifications**
If you enable notifications, no personal data is shared with third parties.

**4. Cookies**
The app does not use cookies for advertising targeting.

**5. Your rights**
Under GDPR, you have the right to access, rectify, and delete your data.`,
    },
  },
  mentions: {
    title: { fr: 'Mentions Légales', en: 'Legal Notice' },
    content: {
      fr: `**Éditeur de l'Application**
Islamic Daily Quote est développée et éditée par un développeur indépendant.

**Hébergement**
Distribuée via l'App Store d'Apple Inc., One Apple Park Way, Cupertino, CA 95014, USA.

**Propriété intellectuelle**
Tous droits réservés. Toute reproduction est interdite sans autorisation préalable.

**Contact**
Utilisez le formulaire de contact disponible sur cette page.`,
      en: `**Publisher**
Islamic Daily Quote is developed and published by an independent developer.

**Hosting**
Distributed via Apple Inc. App Store, One Apple Park Way, Cupertino, CA 95014, USA.

**Intellectual property**
All rights reserved. Any reproduction is prohibited without prior authorization.

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
const IslamicDailyQuoteLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, toggleLang } = useLang();
  const ui = UI[lang];
  const [activeLegal, setActiveLegal] = useState<'cgu' | 'privacy' | 'mentions' | null>(null);
  const [activeQuote, setActiveQuote] = useState(0);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const contactRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const quotesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote(i => (i + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
          subject: formState.subject || 'Contact Islamic Daily Quote',
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
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#070D09] text-[#1D1D1F] dark:text-white overflow-x-hidden transition-colors duration-300">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F5F7]/80 dark:bg-[#070D09]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={appLogo} alt="Islamic Daily Quote" className="w-8 h-8 rounded-xl" />
            <span className="text-lg font-bold tracking-tight text-[#1D1D1F] dark:text-white">
              Islamic <span className="text-[#22C55E]">Daily Quote</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#6E6E73] dark:text-white/60">
            <button onClick={() => scrollTo(featuresRef)} className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">{ui.navFeatures}</button>
            <button onClick={() => scrollTo(quotesRef)} className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">{ui.navQuotes}</button>
            <button onClick={() => scrollTo(contactRef)} className="hover:text-[#1D1D1F] dark:hover:text-white transition-colors">{ui.navContact}</button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="h-7 px-2.5 rounded-md text-[11px] font-bold text-[#6E6E73] dark:text-white/50 hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.08] transition-colors uppercase tracking-wider border border-black/[0.10] dark:border-white/[0.10]"
              aria-label="Toggle language"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button
              onClick={() => navigate('/portefolio')}
              className="text-xs text-[#86868B] dark:text-white/40 hover:text-[#1D1D1F] dark:hover:text-white/80 transition-colors flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              {ui.navBack}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#16A34A]/10 blur-[130px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#4ADE80]/5 blur-[80px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-[#C9A84C]/5 blur-[80px]" />
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #22C55E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#16A34A]/40 rounded-[28px] blur-2xl scale-110" />
              <img src={appLogo} alt="Islamic Daily Quote" className="relative w-28 h-28 rounded-[28px] shadow-2xl object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#4ADE80] text-xs font-semibold mb-6 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              {ui.badge}
            </div>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18, duration: 0.5 }}
            className="text-2xl md:text-3xl text-[#C9A84C]/80 font-arabic mb-4 tracking-wider"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </motion.p>

          <motion.h1
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none"
          >
            {ui.heroTitle}{' '}
            <span className="bg-gradient-to-r from-[#22C55E] to-[#4ADE80] bg-clip-text text-transparent">
              {ui.heroAccent}
            </span>
            <br />{ui.heroTitle2}
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
            <button onClick={() => scrollTo(contactRef)}
              className="px-8 py-4 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-base transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-[#16A34A]/30">
              {ui.ctaBeta}
            </button>
            <button onClick={() => scrollTo(featuresRef)}
              className="px-8 py-4 rounded-2xl bg-black/[0.06] dark:bg-white/[0.06] hover:bg-black/[0.10] dark:hover:bg-white/[0.10] border border-black/10 dark:border-white/10 text-[#1D1D1F] dark:text-white font-medium text-base transition-all duration-200">
              {ui.ctaFeatures}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <section className="border-y border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          {ui.stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-black text-[#22C55E] mb-1">{s.value}</div>
              <div className="text-sm text-[#86868B] dark:text-white/40 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quotes Carousel ────────────────────────────────────── */}
      <section ref={quotesRef} className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#22C55E] mb-3">{ui.quotesEyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{ui.quotesTitle}</h2>
          <p className="text-[#86868B] dark:text-white/40 mt-4 max-w-lg mx-auto">{ui.quotesSub}</p>
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuote}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#0F2A16] to-[#071209] border border-[#22C55E]/20 rounded-3xl p-8 md:p-12 text-center"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#4ADE80] text-xs font-semibold mb-6 tracking-wider uppercase">
                {QUOTES[activeQuote].category[lang]}
              </div>
              <p className="text-3xl md:text-4xl text-[#C9A84C] font-bold mb-6 leading-relaxed tracking-widest">
                {QUOTES[activeQuote].arabic}
              </p>
              <p className="text-lg md:text-xl text-[#1D1D1F] dark:text-white font-medium italic mb-4 leading-relaxed">
                « {QUOTES[activeQuote].text[lang]} »
              </p>
              <p className="text-sm text-[#86868B] dark:text-white/40">{QUOTES[activeQuote].source[lang]}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {QUOTES.map((_, i) => (
              <button key={i} onClick={() => setActiveQuote(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === activeQuote ? 'bg-[#22C55E] w-6' : 'bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40 w-2'}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          {QUOTES.slice(0, 4).map((q, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              onClick={() => setActiveQuote(i)}
              className="bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-5 cursor-pointer hover:border-[#22C55E]/30 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all duration-300"
            >
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#4ADE80] text-[10px] font-semibold uppercase tracking-wider mb-3">
                {q.category[lang]}
              </span>
              <p className="text-sm text-[#6E6E73] dark:text-white/70 italic leading-relaxed mb-2">« {q.text[lang]} »</p>
              <p className="text-[11px] text-[#86868B] dark:text-white/30">{q.source[lang]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section ref={featuresRef} className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#22C55E] mb-3">{ui.featuresEyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{ui.featuresTitle}</h2>
          <p className="text-[#86868B] dark:text-white/40 mt-4 max-w-lg mx-auto">{ui.featuresSub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title.fr}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-6 hover:bg-black/[0.06] dark:hover:bg-white/[0.06] hover:border-[#22C55E]/30 transition-all duration-300"
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#22C55E] mb-3">{ui.screensEyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{ui.screensTitle}</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-[280px] mx-auto"
        >
          <TabletViewer screenshots={[firstImage, appImage, secondImage, thirdImage]} />
        </motion.div>
      </section>

      {/* ── Mission ────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#16A34A]/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#22C55E] mb-4">{ui.missionEyebrow}</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
              {ui.missionTitle}<br />
              <span className="text-[#22C55E]">{ui.missionAccent}</span>
            </h2>
            <p className="text-[#6E6E73] dark:text-white/50 leading-relaxed max-w-md mb-6">{ui.missionText}</p>
            <p className="text-[#C9A84C]/70 text-sm leading-relaxed italic">
              {ui.missionVerse}<br />
              <span className="text-[#86868B] dark:text-white/40 not-italic">{ui.missionVerseSource}</span>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="flex-shrink-0 grid grid-cols-2 gap-4"
          >
            {[firstImage, secondImage].map((src, i) => (
              <img key={i} src={src} alt="" className="w-32 md:w-44 rounded-2xl shadow-xl border border-black/[0.08] dark:border-white/[0.08]" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Legal ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#22C55E] mb-3">{ui.legalEyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">{ui.legalTitle}</h2>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {(Object.keys(LEGAL) as Array<keyof typeof LEGAL>).map((key) => (
            <button key={key}
              onClick={() => setActiveLegal(activeLegal === key ? null : key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${activeLegal === key
                ? 'bg-[#16A34A] border-[#16A34A] text-white'
                : 'bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] text-[#6E6E73] dark:text-white/60 hover:text-[#1D1D1F] dark:hover:text-white hover:border-black/20 dark:hover:border-white/20'}`}
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
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#22C55E] mb-3">{ui.contactEyebrow}</p>
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
                    className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-[#16A34A]/50 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868B] dark:text-white/40 mb-1.5 uppercase tracking-wider">{ui.formEmail}</label>
                  <input type="email" required value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    placeholder="votre@email.com"
                    className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-[#16A34A]/50 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#86868B] dark:text-white/40 mb-1.5 uppercase tracking-wider">{ui.formSubject}</label>
                <input type="text" value={formState.subject}
                  onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                  placeholder={ui.formSubjectPh}
                  className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-[#16A34A]/50 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#86868B] dark:text-white/40 mb-1.5 uppercase tracking-wider">{ui.formMsg}</label>
                <textarea required rows={5} value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  placeholder={ui.formMsgPh}
                  className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-[#16A34A]/50 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all resize-none" />
              </div>
              {formStatus === 'error' && <p className="text-sm text-red-400">{ui.errorMsg}</p>}
              <button type="submit" disabled={formStatus === 'sending'}
                className="w-full py-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-bold text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#16A34A]/20">
                {formStatus === 'sending' ? ui.formSending : ui.formSend}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.06] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#86868B] dark:text-white/30">
          <div className="flex items-center gap-2">
            <img src={appLogo} alt="" className="w-6 h-6 rounded-md" />
            <span>Islamic <span className="text-[#22C55E]/60">Daily Quote</span></span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setActiveLegal('cgu')} className="hover:text-white/60 transition-colors">{ui.footerCgu}</button>
            <button onClick={() => setActiveLegal('privacy')} className="hover:text-white/60 transition-colors">{ui.footerPrivacy}</button>
            <button onClick={() => setActiveLegal('mentions')} className="hover:text-white/60 transition-colors">{ui.footerMentions}</button>
          </div>
          <span>© {new Date().getFullYear()} Islamic Daily Quote. {ui.footerRights}</span>
        </div>
      </footer>
    </div>
  );
};

export default IslamicDailyQuoteLandingPage;
