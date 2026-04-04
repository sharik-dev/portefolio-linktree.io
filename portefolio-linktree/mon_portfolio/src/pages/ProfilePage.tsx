import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang, t } from '../contexts/LangContext';
import { downloadCvAsPdf } from '../utils/downloadCvAsPdf';

import pfpImage from '../assets/pfp.jpg';
import imgGuidor from '../assets/guidor/imageApp.png';
import imgMeowTube from '../assets/meowTube/AppHomePage.png';
import imgLocalShort from '../assets/localShort/screen1.PNG';

/* ─── Bilingual project data ─────────────────────────────────────── */
const PROJECTS = [
  {
    id: 'guidor',
    title: 'Guidor',
    description: {
      fr: 'Application iOS professionnelle pour pilotes de ligne. Analyse météo en temps réel, optimisation de routes, alertes turbulences et intégration avionique ARINC.',
      en: 'Professional iOS app for airline pilots. Real-time weather analysis, route optimization, turbulence alerts and ARINC avionics integration.'
    },
    context: { fr: 'Application professionnelle', en: 'Professional app' },
    image: imgGuidor,
    tags: ['Swift', 'iOS', 'Aviation', 'ARINC'],
    route: '/portefolio',
  },
  {
    id: 'meowtube',
    title: 'Meow-Tube',
    description: {
      fr: 'Application iOS de vidéo sans publicité ni Shorts. Conçue pour une expérience de visionnage concentrée, sans tracking du temps d\'écran.',
      en: 'Ad-free iOS video app without Shorts. Designed for focused viewing, with no screen-time tracking.'
    },
    context: { fr: 'Projet personnel', en: 'Personal project' },
    image: imgMeowTube,
    tags: ['Swift', 'SwiftUI', 'AVFoundation', 'iOS'],
    route: '/portefolio',
  },
  {
    id: 'localshort',
    title: 'LocalShort',
    description: {
      fr: 'Lecteur iOS de vidéos courtes entièrement hors ligne. Import depuis la galerie, lecture fluide et aucune donnée transmise.',
      en: 'Fully offline iOS short-video player. Import from gallery, smooth playback, zero data transmitted.'
    },
    context: { fr: 'Projet personnel', en: 'Personal project' },
    image: imgLocalShort,
    tags: ['Swift', 'SwiftUI', 'AVFoundation', 'iOS'],
    route: '/portefolio',
  },
];

const SKILLS = ['Swift', 'iOS', 'MVVM', 'SwiftUI', 'UIKit', 'AVFoundation', 'Core ML', 'Vision', 'MapboxMaps', 'Git', 'GitHub Actions', 'React.js', 'TypeScript', 'C++'];

const BIO = {
  fr: [
    <>Ingénieur logiciel passionné par le développement <strong className="text-[#1D1D1F] dark:text-white font-semibold">mobile</strong> et <strong className="text-[#1D1D1F] dark:text-white font-semibold">web</strong>, avec une appétence pour les architectures propres et les pipelines <strong className="text-[#1D1D1F] dark:text-white font-semibold">CI/CD</strong>.</>,
    <>Orienté qualité, performance et lisibilité du code. Je conçois des applications robustes, documentées et testées dans un environnement Agile/Scrum.</>
  ],
  en: [
    <>Software Engineer passionate about <strong className="text-[#1D1D1F] dark:text-white font-semibold">mobile</strong> and <strong className="text-[#1D1D1F] dark:text-white font-semibold">web</strong> development, with a focus on clean architectures and <strong className="text-[#1D1D1F] dark:text-white font-semibold">CI/CD</strong> pipelines.</>,
    <>Focused on code quality, performance and readability. I build robust, well-documented, and tested applications in an Agile/Scrum environment.</>
  ],
};

const LANGS = {
  fr: [{ name: 'Français', level: 'Natif' }, { name: 'Malgache', level: 'Natif' }, { name: 'Anglais', level: 'B2/C1' }],
  en: [{ name: 'French', level: 'Native' }, { name: 'Malagasy', level: 'Native' }, { name: 'English', level: 'B2/C1' }],
};

const DETAILS = {
  fr: [
    { label: 'Email', value: 'sharikmohamed8@gmail.com' },
    { label: 'Localisation', value: 'Toulouse, France' },
    { label: 'Disponibilité', value: 'Freelance / CDI' },
    { label: 'Secteur', value: 'iOS / Mobile Engineering' },
  ],
  en: [
    { label: 'Email', value: 'sharikmohamed8@gmail.com' },
    { label: 'Location', value: 'Toulouse, France' },
    { label: 'Availability', value: 'Freelance / Full-time' },
    { label: 'Domain', value: 'Mobile & Web Engineering' },
  ],
};

const ProfilePage: React.FC = () => {
  const { lang } = useLang();
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<'fr' | 'en' | null>(null);

  const handleDownloadPdf = async (targetLang: 'fr' | 'en') => {
    setDownloading(targetLang);
    try {
      const name = targetLang === 'fr' ? 'CV_Sharik_Mohamed_FR.pdf' : 'CV_Sharik_Mohamed_EN.pdf';
      await downloadCvAsPdf(targetLang, name);
    } finally {
      setDownloading(null);
    }
  };

  const ui = {
    fr: {
      eyebrow: 'À propos de moi', title: 'Profil',
      aboutTitle: 'À Propos', aboutOpenTo: ' Ouvert aux opportunités',
      projectsTitle: 'Projets', skillsTitle: 'Compétences clés',
      langsTitle: 'Langues', viewProject: 'Voir le projet',
      contactTitle: 'Contact', contactBtn: 'Envoyer un email',
      cvTitle: 'Télécharger le CV', cvBtn: 'CV PDF',
    },
    en: {
      eyebrow: 'About me', title: 'Profile',
      aboutTitle: 'About', aboutOpenTo: ' Open to opportunities',
      projectsTitle: 'Projects', skillsTitle: 'Core skills',
      langsTitle: 'Languages', viewProject: 'View project',
      contactTitle: 'Contact', contactBtn: 'Send an email',
      cvTitle: 'Download CV', cvBtn: 'CV PDF',
    },
  }[lang];

  return (
    <div className="min-h-screen bg-[#E8E8ED] dark:bg-black transition-colors duration-300">

      {/* Hero header */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-12 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-black/[0.08] dark:border-white/[0.08] shadow-lg mb-5">
          <img src={pfpImage} alt="Sharik Mohamed" className="w-full h-full object-cover" />
        </div>

        {/* Open-to-opportunities badge */}
        <span className="mb-3 text-[11px] font-semibold px-3 py-1 rounded-full bg-[#34C759]/10 text-[#27AE60] border border-[#34C759]/20">
          {ui.aboutOpenTo}
        </span>

        <h1 className="text-3xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-1">Sharik Mohamed</h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] mb-1.5">
          {t(lang, 'Ingénieur Logiciel · Développeur iOS', 'Software Engineer · iOS Developer')}
        </p>
        <p className="text-[13px] text-[#86868B] dark:text-[#636366] flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
          Toulouse, France
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 space-y-10">

        {/* About */}
        <section>
          <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.aboutTitle}</h2>
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {/* Bio */}
              <div>
                {BIO[lang].map((line, i) => (
                  <p key={i} className="text-[13px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-3 last:mb-0">{line}</p>
                ))}
              </div>

              {/* Details card */}
              <div className="mt-6 md:mt-0 space-y-3.5">
                {DETAILS[lang].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] font-semibold text-[#86868B] uppercase tracking-[0.08em]">{item.label}</p>
                    <p className="text-[13px] text-[#1D1D1F] dark:text-white font-medium mt-0.5">
                      {item.label.toLowerCase().includes('mail') || item.label.toLowerCase().includes('email')
                        ? <a href={`mailto:${item.value}`} className="text-[#0071E3] hover:underline">{item.value}</a>
                        : item.value}
                    </p>
                  </div>
                ))}

                {/* Languages */}
                <div>
                  <p className="text-[10px] font-semibold text-[#86868B] uppercase tracking-[0.08em] mb-2">{ui.langsTitle}</p>
                  <div className="flex flex-wrap gap-2">
                    {LANGS[lang].map(l => (
                      <span key={l.name} className="flex items-center gap-1.5 text-[12px] bg-[#E8E8ED] dark:bg-[#2C2C2E] border border-black/[0.10] dark:border-white/[0.06] px-3 py-1 rounded-full">
                        <span className="font-semibold text-[#1D1D1F] dark:text-white">{l.name}</span>
                        <span className="text-[#6E6E73] dark:text-[#98989D]">— {l.level}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.projectsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PROJECTS.map(project => (
              <Link key={project.id} to={project.route} className="block group">
                <motion.div whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }}
                  className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="h-44 overflow-hidden bg-[#E8E8ED]">
                    <img src={project.image} alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    {/* Context badge */}
                    <span className="text-[10px] font-medium text-[#6E6E73] dark:text-[#98989D] bg-[#E8E8ED] dark:bg-[#2C2C2E] px-2 py-0.5 rounded-full">
                      {t(lang, project.context.fr, project.context.en)}
                    </span>
                    <h3 className="text-[13px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight mt-1.5 mb-1">{project.title}</h3>
                    <p className="text-[12px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-3 line-clamp-3">
                      {t(lang, project.description.fr, project.description.en)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E8E8ED] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#98989D] border border-black/[0.10] dark:border-white/[0.06]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0071E3] group-hover:text-[#0077ED] transition-colors">
                      {ui.viewProject}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        className="transition-transform group-hover:translate-x-0.5"><polyline points="9 18 15 12 9 6" /></svg>
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Skills cloud */}
        <section>
          <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">{ui.skillsTitle}</h2>
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(skill => (
                <button key={skill} onClick={() => setActiveSkill(s => s === skill ? null : skill)}
                  className={`text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-150 ${activeSkill === skill
                    ? 'bg-[#0071E3] text-white shadow-sm'
                    : 'bg-[#E8E8ED] dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-[#E5E5E7] hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] border border-black/[0.10] dark:border-white/[0.06]'
                    }`}>
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Contact + CV download row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Contact */}
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-6 shadow-sm text-center flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-[#0071E3]/[0.08] flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="1.5"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#0071E3" stroke="none" /></svg>
            </div>
            <h3 className="text-[14px] font-semibold text-[#1D1D1F] dark:text-white mb-3">{ui.contactTitle}</h3>
            <a href="mailto:sharikmohamed8@gmail.com"
              className="inline-flex items-center gap-2 bg-[#0071E3] text-white px-5 py-2 rounded-full text-[13px] font-medium hover:bg-[#0077ED] transition-colors">
              {ui.contactBtn}
            </a>
          </div>

          {/* CV download */}
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.10] dark:border-white/[0.06] rounded-2xl p-6 shadow-sm text-center flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-[#0071E3]/[0.08] flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" /></svg>
            </div>
            <h3 className="text-[14px] font-semibold text-[#1D1D1F] dark:text-white mb-3">{ui.cvTitle}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownloadPdf('fr')}
                disabled={downloading === 'fr'}
                className="inline-flex items-center gap-1.5 bg-[#0071E3] text-white px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#0077ED] transition-colors disabled:opacity-60"
              >
                🇫🇷 {downloading === 'fr' ? '…' : 'FR'}
              </button>
              <button
                onClick={() => handleDownloadPdf('en')}
                disabled={downloading === 'en'}
                className="inline-flex items-center gap-1.5 bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white border border-black/[0.12] dark:border-white/[0.12] px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#F5F5F7] dark:hover:bg-[#3A3A3C] transition-colors disabled:opacity-60"
              >
                🇬🇧 {downloading === 'en' ? '…' : 'EN'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;