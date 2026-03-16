import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioPage, LinkTreePage, CvPage, ProfilePage, MeowTubeLandingPage } from '../pages';
import { Layout } from '../components/layout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><LinkTreePage /></Layout>} />
      <Route path="/portefolio" element={<Layout><PortfolioPage /></Layout>} />
      <Route path="/cv" element={<Layout><CvPage /></Layout>} />
      <Route path="/profil" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/meowtube" element={<MeowTubeLandingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;