import React from 'react';
import Button, { ButtonStyle, ButtonSize, ButtonShape } from './Button';

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
  const handleClick = () => {
    if (url.startsWith('/')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Button
      title={name}
      icon={icon}
      style={style}
      size={ButtonSize.Large}
      shape={ButtonShape.Pill}
      onClick={handleClick}
      className={`w-full ${className}`}
    />
  );
};

export default SocialButton;