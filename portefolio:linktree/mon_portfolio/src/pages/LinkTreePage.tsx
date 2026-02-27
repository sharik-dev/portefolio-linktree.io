import React from 'react';
import { ButtonStyle } from '../components';
import SocialButton from '../components/SocialButton';
import { LinkedInIcon, GitHubIcon, EmailIcon, PortfolioIcon } from '../components/icons';
import { useLang, t } from '../contexts/LangContext';

const LinkTreePage: React.FC = () => {
  const { lang } = useLang();

  const socialLinks = [
    { name: 'Portfolio', url: '/portefolio', icon: <PortfolioIcon />, style: ButtonStyle.Primary },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/sharik-abubucker-393194205/', icon: <LinkedInIcon />, style: ButtonStyle.Secondary },
    { name: 'GitHub', url: 'https://github.com/sharik-dev', icon: <GitHubIcon />, style: ButtonStyle.Secondary },
    { name: 'Email', url: 'mailto:sharikmohamed8@gmail.com', icon: <EmailIcon />, style: ButtonStyle.Tertiary },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex flex-col items-center px-5 pt-14 pb-8 transition-colors duration-300">

      <header className="w-full max-w-sm flex flex-col items-center mb-10">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border border-black/[0.08] dark:border-white/[0.08] shadow-lg mb-5">
          <img
            src="https://media.licdn.com/dms/image/v2/D4E03AQGqJf1Y0BjJrA/profile-displayphoto-shrink_400_400/B4EZbEjXXqHIAg-/0/1747054327832?e=1773878400&v=beta&t=cYeI6lNTlNILW_oHrEfY7npeU1RSY8yge91WdLIA0Iw"
            alt="Sharik Mohamed"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-[22px] font-bold tracking-tight text-[#1D1D1F] dark:text-white mb-1">
          Sharik Mohamed
        </h1>

        <p className="text-[14px] text-[#6E6E73] dark:text-[#98989D] text-center">
          {t(lang, 'Ingénieur Logiciel · Développeur iOS', 'Software Engineer · iOS Developer')}
        </p>

        <p className="mt-1.5 text-[13px] text-[#86868B] dark:text-[#636366] flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          Toulouse, France
        </p>
      </header>

      <main className="w-full max-w-sm flex flex-col gap-3">
        {socialLinks.map((link, i) => (
          <SocialButton key={i} name={link.name} url={link.url} icon={link.icon} style={link.style} />
        ))}

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {['Swift', 'iOS', 'UIKIT', 'SwiftUI', 'Mapbox'].map(tag => (
            <span key={tag} className="text-[11px] font-medium px-3 py-1 rounded-full bg-white dark:bg-[#1C1C1E] text-[#6E6E73] dark:text-[#98989D] border border-black/[0.08] dark:border-white/[0.06] shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </main>

      <footer className="mt-auto pt-10 text-[12px] text-[#86868B] dark:text-[#636366]">
        © 2026 · Sharik Mohamed
      </footer>
    </div>
  );
};

export default LinkTreePage;