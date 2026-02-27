import React from 'react';
import Button, { ButtonStyle, ButtonSize, ButtonShape } from './Button';

interface IconButtonProps {
  icon: React.ReactNode;
  style?: ButtonStyle;
  size?: ButtonSize.SquareLarge | ButtonSize.SquareMedium | ButtonSize.SquareSmall | ButtonSize.SquareXSmall;
  onClick: () => void;
  className?: string;
  ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  style = ButtonStyle.Primary,
  size = ButtonSize.SquareMedium,
  onClick,
  className = '',
  ariaLabel
}) => {
  return (
    <Button
      icon={icon}
      style={style}
      size={size}
      shape={ButtonShape.Square}
      onClick={onClick}
      className={`icon-button ${className}`}
      title=""
      aria-label={ariaLabel}
    />
  );
};

export default IconButton; 