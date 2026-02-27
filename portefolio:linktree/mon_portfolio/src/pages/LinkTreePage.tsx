import React from 'react';
import { ButtonStyle } from '../components';
import SocialButton from '../components/SocialButton';
import {
  LinkedInIcon,
  GitHubIcon,
  EmailIcon,
  PortfolioIcon
} from '../components/icons';
import './LinkTreePage.css';

const LinkTreePage: React.FC = () => {
  // Liste des réseaux sociaux (vous pourrez modifier les URL plus tard)
  const socialLinks = [
    {
      name: 'Portfolio',
      url: '/portefolio',
      icon: <PortfolioIcon />,
      style: ButtonStyle.Primary
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/',
      icon: <LinkedInIcon />,
      style: ButtonStyle.Secondary
    },
    {
      name: 'GitHub',
      url: 'https://github.com/',
      icon: <GitHubIcon />,
      style: ButtonStyle.Tertiary
    },
    {
      name: 'Email',
      url: 'mailto:contact@example.com',
      icon: <EmailIcon />,
      style: ButtonStyle.Orange
    }
  ];

  return (
    <div className="linktree-page">
      <header className="linktree-page__header">
        <div className="linktree-page__profile">
          <div className="linktree-page__avatar">
            {/* Emplacement pour la photo de profil */}
            <div className="linktree-page__avatar-placeholder">S</div>
          </div>
          <h1 className="linktree-page__title">Sharik Mohamed</h1>
          <p className="linktree-page__description">
            Développeur Web Fullstack | Créateur de contenu | Designer
          </p>
        </div>
      </header>

      <main className="linktree-page__content">
        <div className="linktree-page__links">
          {socialLinks.map((link, index) => (
            <SocialButton
              key={index}
              name={link.name}
              url={link.url}
              icon={link.icon}
              style={link.style}
            />
          ))}
        </div>
      </main>

      <footer className="linktree-page__footer">
        <p>© 2023 - Sharik Mohamed</p>
      </footer>
    </div>
  );
};

export default LinkTreePage; 