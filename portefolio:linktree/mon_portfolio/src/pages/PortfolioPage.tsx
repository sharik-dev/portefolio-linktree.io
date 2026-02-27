import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TabletViewer from '../components/TabletViewer';
import './PortfolioPage.css';

// Types pour les applications
interface AppInfo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  screenshots: string[];
  features: string[];
  price: string;
  category: string;
  featured?: boolean;
  new?: boolean;
  rating: number;
}

// Applications fictives avec des images réelles
const apps: AppInfo[] = [
  {
    id: 'app1',
    name: 'MindFlow',
    subtitle: 'Méditation & Focus',
    description: 'Une application de méditation guidée pour améliorer la concentration et réduire le stress. Inclut des sons ambiants et des exercices de respiration pour vous aider à rester concentré.',
    icon: 'https://cdn-icons-png.flaticon.com/512/6295/6295532.png',
    screenshots: [
      'https://img.freepik.com/free-vector/gradient-mindfulness-app-interface_23-2149099708.jpg',
      'https://img.freepik.com/free-vector/gradient-mindfulness-app-screens_23-2149099694.jpg',
      'https://img.freepik.com/free-vector/gradient-meditation-app-interface_23-2149116595.jpg'
    ],
    features: ['Méditation guidée', 'Sons ambiants', 'Exercices de respiration', 'Suivi de progression'],
    price: 'Gratuit, achats intégrés',
    category: 'Santé & Bien-être',
    featured: true,
    rating: 4.8
  },
  {
    id: 'app2',
    name: 'TaskMaster',
    subtitle: 'Productivité Avancée',
    description: 'Organisez vos tâches et projets avec cette application de productivité intuitive. Synchronisation entre tous vos appareils et notifications intelligentes.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2387/2387635.png',
    screenshots: [
      'https://img.freepik.com/free-vector/app-dashboard-tasks-dark-mode_23-2148703295.jpg',
      'https://img.freepik.com/free-vector/application-mobile-statistics-dashboard_23-2148607159.jpg',
      'https://img.freepik.com/free-vector/application-mobile-control-dashboard_23-2148607161.jpg'
    ],
    features: ['Listes de tâches', 'Calendrier intégré', 'Notifications intelligentes', 'Synchronisation multi-appareils'],
    price: '4.99 €',
    category: 'Productivité',
    new: true,
    rating: 4.6
  },
  {
    id: 'app3',
    name: 'PixelCraft',
    subtitle: 'Édition Photo Créative',
    description: "Un éditeur photo puissant avec des filtres uniques et des outils de retouche professionnels. Créez des œuvres d'art à partir de vos photos en quelques tapotements.",
    icon: 'https://cdn-icons-png.flaticon.com/512/4503/4503941.png',
    screenshots: [
      'https://img.freepik.com/free-vector/photo-editing-app-interface-template_23-2148661030.jpg',
      'https://img.freepik.com/free-vector/photo-editor-mobile-app-ui-design_23-2148661031.jpg',
      'https://img.freepik.com/free-vector/photo-editing-app-interface-concept_23-2148661027.jpg'
    ],
    features: ['Filtres artistiques', 'Outils de retouche', 'Couches et masques', 'Partage sur réseaux sociaux'],
    price: '9.99 €',
    category: 'Photo & Vidéo',
    featured: true,
    rating: 4.9
  },
  {
    id: 'app4',
    name: 'FitnessPlus',
    subtitle: 'Entraînement Personnel',
    description: "Votre coach personnel dans votre poche. Des centaines d'exercices et programmes d'entraînement pour tous les niveaux de forme physique et objectifs.",
    icon: 'https://cdn-icons-png.flaticon.com/512/2936/2936886.png',
    screenshots: [
      'https://img.freepik.com/free-vector/fitness-tracker-app-interface_23-2148633832.jpg',
      'https://img.freepik.com/free-vector/fitness-tracker-concept-ui-ux-design_23-2148633842.jpg',
      'https://img.freepik.com/free-vector/fitness-tracker-app-interface-concept_23-2148633841.jpg'
    ],
    features: ['Programmes personnalisés', 'Suivi des progrès', "Bibliothèque d'exercices", 'Intégration avec Apple Health'],
    price: 'Abonnement 6.99 €/mois',
    category: 'Santé & Fitness',
    new: true,
    rating: 4.7
  },
  {
    id: 'app5',
    name: 'SoundScape',
    subtitle: 'Production Musicale',
    description: "Créez de la musique professionnelle où que vous soyez. Un studio d'enregistrement complet dans votre poche avec des instruments virtuels et des effets de qualité studio.",
    icon: 'https://cdn-icons-png.flaticon.com/512/2829/2829076.png',
    screenshots: [
      'https://img.freepik.com/free-vector/music-player-app_23-2148629462.jpg',
      'https://img.freepik.com/free-vector/music-player-app-interface_23-2148629444.jpg',
      'https://img.freepik.com/free-vector/music-player-app-template_23-2148629443.jpg'
    ],
    features: ['Instruments virtuels', 'Effets audio', 'Pistes multiples', 'Partage de projets'],
    price: '14.99 €',
    category: 'Musique',
    featured: true,
    rating: 4.5
  },
  {
    id: 'app6',
    name: 'CryptoView',
    subtitle: 'Suivi Crypto & Finance',
    description: 'Suivez vos investissements en cryptomonnaies et actions en temps réel. Analyses avancées et notifications de prix pour ne jamais manquer une opportunité.',
    icon: 'https://cdn-icons-png.flaticon.com/512/5341/5341569.png',
    screenshots: [
      'https://img.freepik.com/free-vector/dashboard-user-panel-template_23-2148627015.jpg',
      'https://img.freepik.com/free-vector/crypto-dashboard-concept_23-2148627011.jpg',
      'https://img.freepik.com/free-vector/dashboard-template-gradient-style_23-2148627124.jpg'
    ],
    features: ['Suivi de portefeuille', 'Alertes de prix', 'Graphiques avancés', 'Actualités financières'],
    price: 'Gratuit, abonnement premium disponible',
    category: 'Finance',
    new: true,
    rating: 4.3
  }
];

// Composant de carte d'application
const AppCard: React.FC<{ app: AppInfo, onClick: () => void }> = ({ app, onClick }) => {
  return (
    <motion.div
      className="app-card"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="app-card__icon-container">
        <img src={app.icon} alt={`Icône de ${app.name}`} className="app-card__icon" />
      </div>
      <div className="app-card__info">
        <h3 className="app-card__title">{app.name}</h3>
        <p className="app-card__subtitle">{app.subtitle}</p>
        {app.featured && <span className="app-card__badge app-card__badge--featured">À la une</span>}
        {app.new && <span className="app-card__badge app-card__badge--new">Nouveau</span>}
        <div className="app-card__rating">
          <div className="app-card__stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(app.rating) ? "app-card__star--filled" : "app-card__star"}>★</span>
            ))}
          </div>
          <span className="app-card__rating-text">{app.rating.toFixed(1)}</span>
        </div>
        <div className="app-card__price">{app.price}</div>
      </div>
    </motion.div>
  );
};

// Visualisation 3D GLB de la tablette
const GLBTabletViewer: React.FC<{ app: AppInfo, onViewDetails: () => void }> = ({ app, onViewDetails }) => {
  return (
    <div className="portfolio__glb-tablet">
      <TabletViewer screenshotUrl={app.screenshots[0]} />
      <div className="portfolio__tablet-info">
        <h3>{app.name}</h3>
        <p>{app.subtitle}</p>
        <p className="portfolio__tablet-hint">↔ Rotation automatique · Cliquez-glissez pour explorer</p>
        <button
          className="portfolio__view-button"
          onClick={onViewDetails}
        >
          Voir les détails
        </button>
      </div>
    </div>
  );
};

// Composant principal de la page portfolio
const PortfolioPage: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppInfo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextTablet = () => {
    setCurrentIndex((prev) => (prev + 1) % apps.length);
  };

  const handlePrevTablet = () => {
    setCurrentIndex((prev) => (prev - 1 + apps.length) % apps.length);
  };

  // Fonctions pour ouvrir/fermer la modal d'app
  const openAppDetails = (app: AppInfo) => {
    setCurrentApp(app);
  };

  const closeAppDetails = () => {
    setCurrentApp(null);
  };

  // Filtrer les applications mises en avant
  const featuredApps = apps.filter(app => app.featured);
  const newApps = apps.filter(app => app.new);

  return (
    <div className="portfolio-page">
      <div className="portfolio__glass-background"></div>

      <header className="portfolio__header">
        <h1 className="portfolio__title">App Portfolio</h1>
        <p className="portfolio__description">
          Découvrez mes créations d'applications mobiles
        </p>
      </header>

      <main className="portfolio__content">
        {/* Section tablette interactive */}
        <section className="portfolio__tablet-showcase">
          <h2 className="portfolio__section-title">Applications en vedette</h2>
          <div className="portfolio__tablet-container">
            <button className="portfolio__tablet-nav portfolio__tablet-nav--prev" onClick={handlePrevTablet}>
              ◀
            </button>

            <div className="portfolio__tablet-viewer">
              <GLBTabletViewer
                app={apps[currentIndex]}
                onViewDetails={() => openAppDetails(apps[currentIndex])}
              />
            </div>

            <button className="portfolio__tablet-nav portfolio__tablet-nav--next" onClick={handleNextTablet}>
              ▶
            </button>
          </div>
        </section>

        {/* Section applications à la une */}
        <section className="portfolio__featured">
          <h2 className="portfolio__section-title">À la une aujourd'hui</h2>
          <div className="portfolio__featured-apps">
            {featuredApps.map(app => (
              <AppCard key={app.id} app={app} onClick={() => openAppDetails(app)} />
            ))}
          </div>
        </section>

        {/* Section nouvelles applications */}
        <section className="portfolio__new">
          <h2 className="portfolio__section-title">Nouveautés</h2>
          <div className="portfolio__apps-grid">
            {newApps.map(app => (
              <AppCard key={app.id} app={app} onClick={() => openAppDetails(app)} />
            ))}
          </div>
        </section>

        {/* Section toutes les applications */}
        <section className="portfolio__all-apps">
          <h2 className="portfolio__section-title">Toutes les applications</h2>
          <div className="portfolio__apps-grid">
            {apps.map(app => (
              <AppCard key={app.id} app={app} onClick={() => openAppDetails(app)} />
            ))}
          </div>
        </section>
      </main>

      {/* Modal de détails d'application */}
      {currentApp && (
        <div className="app-details-modal">
          <div className="app-details-modal__overlay" onClick={closeAppDetails}></div>
          <motion.div
            className="app-details-modal__content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <button className="app-details-modal__close" onClick={closeAppDetails}>×</button>

            <div className="app-details-modal__header">
              <img src={currentApp.icon} alt={`Icône de ${currentApp.name}`} className="app-details-modal__icon" />
              <div className="app-details-modal__title-container">
                <h2 className="app-details-modal__title">{currentApp.name}</h2>
                <p className="app-details-modal__subtitle">{currentApp.subtitle}</p>
                <div className="app-details-modal__meta">
                  <span className="app-details-modal__category">{currentApp.category}</span>
                  <div className="app-details-modal__rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(currentApp.rating) ? "app-details-modal__star--filled" : "app-details-modal__star"}>★</span>
                    ))}
                    <span className="app-details-modal__rating-count">({currentApp.rating.toFixed(1)})</span>
                  </div>
                </div>
              </div>
              <button className="app-details-modal__get-button">OBTENIR</button>
            </div>

            <div className="app-details-modal__screenshots">
              {currentApp.screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot}
                  alt={`Capture d'écran ${index + 1} de ${currentApp.name}`}
                  className="app-details-modal__screenshot"
                />
              ))}
            </div>

            <div className="app-details-modal__description">
              <h3 className="app-details-modal__section-title">Description</h3>
              <p>{currentApp.description}</p>
            </div>

            <div className="app-details-modal__features">
              <h3 className="app-details-modal__section-title">Fonctionnalités</h3>
              <ul className="app-details-modal__features-list">
                {currentApp.features.map((feature, index) => (
                  <li key={index} className="app-details-modal__feature-item">{feature}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage; 