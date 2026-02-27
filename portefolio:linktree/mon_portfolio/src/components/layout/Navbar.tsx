import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LangContext';

const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();

  const navLinks = [
    { to: '/', label: lang === 'fr' ? 'LinkTree' : 'LinkTree' },
    { to: '/portefolio', label: lang === 'fr' ? 'Portfolio' : 'Portfolio' },
    { to: '/cv', label: 'CV' },
    { to: '/profil', label: lang === 'fr' ? 'Profil' : 'Profile' },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[13px] font-medium transition-colors duration-150 ${isActive
      ? 'text-[#0071E3]'
      : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white'
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 h-12 flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-[14px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight hover:opacity-75 transition-opacity"
          >
            Sharik<span className="text-[#0071E3]">.dev</span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="h-7 px-2 rounded-md text-[11px] font-semibold text-[#6E6E73] dark:text-[#98989D] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors uppercase tracking-wider"
              aria-label="Toggle language"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#6E6E73] dark:text-[#98989D] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center text-[#1D1D1F] dark:text-white"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-9"
          onClick={() => setMenuOpen(false)}
        >
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-[28px] font-semibold tracking-tight transition-colors ${isActive ? 'text-[#0071E3]' : 'text-[#1D1D1F] dark:text-white'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;