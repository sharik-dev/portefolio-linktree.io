import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioPage, DesktopPage, GamesPage, LinkTreePage, CvPage, ProfilePage, MeowTubeLandingPage, IslamicDailyQuoteLandingPage, LocalShortLandingPage, DashboardPage, GameAnalyticsPage, StorePage } from '../pages';
import { Layout } from '../components/layout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><LinkTreePage /></Layout>} />
      <Route path="/portefolio" element={<Layout><PortfolioPage /></Layout>} />
      <Route path="/desktop" element={<Layout><DesktopPage /></Layout>} />
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