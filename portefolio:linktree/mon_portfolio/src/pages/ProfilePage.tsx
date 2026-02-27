import React, { useState } from 'react';
import { motion } from 'framer-motion';

const personalProjects = [
  {
    id: 'focusfast',
    title: 'FocusFast',
    description: 'Application iOS de vidéos courtes (type TikTok) avec feed vertical, catégories, commentaires, notes et upload vidéo. Architecture MVVM avec AVFoundation.',
    image: 'https://img.freepik.com/free-vector/gradient-mindfulness-app-interface_23-2149099708.jpg',
    tags: ['Swift', 'MVVM', 'AVFoundation', 'UIKit'],
    link: 'https://github.com/sharik-mohamed/focusfast',
  },
  {
    id: 'mapbox-weather',
    title: 'MapboxMaps Weather Layers',
    description: 'Intégration de couches météo multiples sur MapboxMaps SDK v10+ pour Skyconseil. Filtres JSON dynamiques, expressions de zoom, compatibilité legacy/v10.',
    image: 'https://img.freepik.com/free-vector/dashboard-user-panel-template_23-2148627015.jpg',
    tags: ['Swift', 'MapboxMaps v10+', 'JSON', 'iOS'],
    link: 'https://github.com/sharik-mohamed',
  },
  {
    id: 'guidor',
    title: 'Guidor',
    description: 'Système de guidage embarqué développé avec Arduino et C++ pour Le Facteur Humain & Combustible Numérique.',
    image: 'https://img.freepik.com/free-vector/app-dashboard-tasks-dark-mode_23-2148703295.jpg',
    tags: ['C++', 'Arduino', 'Embarqué'],
    link: 'https://github.com/sharik-mohamed',
  },
];

const skills = [
  'Swift', 'iOS', 'MVVM', 'MapboxMaps', 'AVFoundation',
  'Git', 'GitHub Actions', 'React.js', 'TypeScript', 'C++',
];

const langues = [
  { name: 'Français', level: 'Natif', percent: 100 },
  { name: 'Anglais', level: 'B2/C1', percent: 88 },
];

const ProfilePage: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] transition-colors duration-300">

      {/* Header */}
      <header className="bg-white dark:bg-[#1D1D1F] border-b border-black/[0.06] dark:border-white/[0.06] px-6 py-12 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-black/[0.08] dark:border-white/[0.08] shadow-lg mb-5 bg-gradient-to-br from-[#0071E3] to-[#34AADC] flex items-center justify-center">
          <span className="text-white text-4xl font-bold select-none">S</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-1">Sharik Mohamed</h1>
        <p className="text-base text-[#6E6E73] dark:text-[#98989D] mb-1">Ingénieur Logiciel · Développeur iOS</p>
        <p className="text-[13px] text-[#86868B] dark:text-[#636366] flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
          Toulouse, France · Disponible Freelance / CDI
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 space-y-10">

        {/* About */}
        <section>
          <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">À Propos</h2>
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <p className="text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-3">
                  Ingénieur logiciel spécialisé en développement iOS, avec une expertise en architecture <strong className="text-[#1D1D1F] dark:text-white font-semibold">MVVM</strong>, intégration <strong className="text-[#1D1D1F] dark:text-white font-semibold">MapboxMaps SDK</strong> et CI/CD.
                </p>
                <p className="text-sm text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
                  Orienté qualité, performance et lisibilité du code. Je conçois des applications mobiles robustes, documentées et testées dans un environnement Agile/Scrum.
                </p>
              </div>
              <div className="mt-6 md:mt-0 space-y-4">
                {[
                  { label: 'Email', value: 'contact@sharikmohamed.dev' },
                  { label: 'Localisation', value: 'Toulouse, France' },
                  { label: 'Disponibilité', value: 'Freelance / CDI' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[11px] font-semibold text-[#86868B] uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-white font-medium mt-0.5">{item.value}</p>
                  </div>
                ))}

                <div>
                  <p className="text-[11px] font-semibold text-[#86868B] uppercase tracking-widest mb-2">Langues</p>
                  {langues.map(l => (
                    <div key={l.name} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-[#1D1D1F] dark:text-white">{l.name}</span>
                        <span className="text-[12px] text-[#0071E3] font-medium">{l.level}</span>
                      </div>
                      <div className="h-1 bg-[#E8E8ED] dark:bg-[#2C2C2E] rounded-full">
                        <div className="h-full bg-gradient-to-r from-[#0071E3] to-[#34AADC] rounded-full" style={{ width: `${l.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">Projets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {personalProjects.map(project => (
              <motion.div
                key={project.id}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="h-36 overflow-hidden bg-[#F5F5F7]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[14px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight mb-1">{project.title}</h3>
                  <p className="text-[12px] text-[#6E6E73] dark:text-[#98989D] leading-relaxed mb-3 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#98989D] border border-black/[0.06] dark:border-white/[0.06]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors"
                  >
                    Voir le projet
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills cloud */}
        <section>
          <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mb-4">Compétences clés</h2>
          <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <button
                  key={skill}
                  onClick={() => setActiveSkill(s => s === skill ? null : skill)}
                  className={`text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-150 ${activeSkill === skill
                      ? 'bg-[#0071E3] text-white shadow-sm'
                      : 'bg-[#F5F5F7] dark:bg-[#2C2C2E] text-[#6E6E73] dark:text-[#98989D] hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C] border border-black/[0.06] dark:border-white/[0.06]'
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;