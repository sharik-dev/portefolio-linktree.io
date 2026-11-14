import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioPage, WebPage, GamesPage, LinkTreePage, CvPage, ProfilePage, MeowTubeLandingPage, IslamicDailyQuoteLandingPage, LocalShortLandingPage, DashboardPage, GameAnalyticsPage, StorePage } from '../pages';
import { Layout } from '../components/layout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><LinkTreePage /></Layout>} />
      <Route path="/portefolio" element={<Layout><PortfolioPage /></Layout>} />
      <Route path="/web" element={<Layout><WebPage /></Layout>} />
      {/* Ancienne page « App Desktop », remplacée par les projets web. */}
      <Route path="/desktop" element={<Navigate to="/web" replace />} />
      <Route path="/jeux" element={<Layout><GamesPage /></Layout>} />
      <Route path="/cv" element={<Layout><CvPage /></Layout>} />
      <Route path="/profil" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/store" element={<Layout><StorePage /></Layout>} />
      <Route path="/meowtube" element={<MeowTubeLandingPage />} />
      <Route path="/islamic-daily-quote" element={<IslamicDailyQuoteLandingPage />} />
      <Route path="/local-short" element={<LocalShortLandingPage />} />
      <Route path="/dash" element={<DashboardPage />} />
      <Route path="/dash/games" element={<GameAnalyticsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;