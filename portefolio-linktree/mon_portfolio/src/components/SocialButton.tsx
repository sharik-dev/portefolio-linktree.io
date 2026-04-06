import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonStyle } from './Button';

interface SocialButtonProps {
  name: string;
  url: string;
  icon: React.ReactNode;
  style?: ButtonStyle;
  className?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  name,
  url,
  icon,
  style = ButtonStyle.Primary,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (url.startsWith('/')) {
      navigate(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const styleClasses: Record<string, string> = {
    primary: 'bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-sm hover:shadow-md',
    secondary: 'bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-white border border-black/[0.08] dark:border-white/[0.14] shadow-sm hover:shadow-md hover:bg-[#F9F9F9] dark:hover:bg-[#2C2C2E]',
  };

  const [isPressed, setIsPressed] = React.useState(false);

  const handlePress = () => {
    setIsPressed(true);
    if ('vibrate' in navigator) navigator.vibrate(10);
    setTimeout(() => setIsPressed(false), 100);
    handleClick();
  };

  return (
    <button
      type="button"
      onClick={handlePress}
      className={[
        'relative w-full h-[50px] rounded-full font-medium cursor-pointer',
        'transition-all duration-150 ease-in-out select-none',
        'focus-visible:outline-2 focus-visible:outline-[#0071E3] focus-visible:outline-offset-2',
        styleClasses[style] ?? styleClasses.secondary,
        isPressed ? 'scale-[0.97]' : 'scale-100',
        className,
      ].join(' ')}
    >
      {/* 3-column layout: icon | label centered | spacer */}
      <span className="flex items-center w-full px-5">
        {/* Left: icon at fixed position */}
        <span className="flex items-center justify-center w-6 h-6 flex-shrink-0">
          {icon}
        </span>
        {/* Center: label takes remaining space, centered */}
        <span className="flex-1 text-center text-base">
          {name}
        </span>
        {/* Right spacer mirrors the icon width to keep label visually centered */}
        <span className="w-6 flex-shrink-0" />
      </span>
    </button>
  );
};

export default SocialButton;