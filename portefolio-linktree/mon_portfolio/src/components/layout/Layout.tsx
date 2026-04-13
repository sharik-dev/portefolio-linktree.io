import React from 'react';
import Navbar from './Navbar';
import { useVisitorTracker } from '../../hooks/useVisitorTracker';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useVisitorTracker();
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;