import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <NavLink to="/" className="navbar__logo">
          Sharik<span className="navbar__logo-accent">Portfolio</span>
        </NavLink>

        <div className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
            onClick={() => setMenuOpen(false)}
          >
            LinkTree
          </NavLink>
          <NavLink
            to="/portefolio"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
            onClick={() => setMenuOpen(false)}
          >
            Portefolio
          </NavLink>
          <NavLink
            to="/cv"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
            onClick={() => setMenuOpen(false)}
          >
            CV
          </NavLink>
          <NavLink
            to="/profil"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
            }
            onClick={() => setMenuOpen(false)}
          >
            Profil
          </NavLink>
        </div>

        <button className="navbar__toggle" onClick={toggleMenu} aria-label="Menu">
          <span className="navbar__toggle-icon"></span>
          <span className="navbar__toggle-icon"></span>
          <span className="navbar__toggle-icon"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 