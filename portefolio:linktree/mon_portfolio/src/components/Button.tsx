import React, { useState } from 'react';

export enum ButtonStyle {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
  Cyan = 'cyan',
  Orange = 'orange',
  Pink = 'pink',
  Purple = 'purple'
}

export enum ButtonSize {
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
  XSmall = 'xsmall',
  SquareLarge = 'squareLarge',
  SquareMedium = 'squareMedium',
  SquareSmall = 'squareSmall',
  SquareXSmall = 'squareXsmall'
}

export enum ButtonShape {
  Rectangle = 'rectangle',
  Square = 'square',
  Pill = 'pill'
}

interface ButtonProps {
  title?: string;
  style?: ButtonStyle;
  size?: ButtonSize;
  shape?: ButtonShape;
  icon?: React.ReactNode;
  className?: string;
  onClick: () => void;
}

const styleClasses: Record<ButtonStyle, string> = {
  [ButtonStyle.Primary]: 'bg-[#0071E3] text-white hover:bg-[#0077ED] shadow-sm hover:shadow-md',
  [ButtonStyle.Secondary]: 'bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-white border border-black/[0.08] dark:border-white/[0.14] shadow-sm hover:shadow-md hover:bg-[#F9F9F9] dark:hover:bg-[#2C2C2E]',
  [ButtonStyle.Tertiary]: 'bg-transparent text-[#0071E3] border border-[#0071E3] hover:bg-[#0071E3]/[0.06]',
  [ButtonStyle.Success]: 'bg-[#34C759] text-white hover:bg-[#30B04E] shadow-sm',
  [ButtonStyle.Warning]: 'bg-[#FF9F0A] text-white hover:bg-[#E8900A] shadow-sm',
  [ButtonStyle.Error]: 'bg-[#FF3B30] text-white hover:bg-[#E5352C] shadow-sm',
  [ButtonStyle.Info]: 'bg-[#34AADC] text-white hover:bg-[#2D99C8]',
  [ButtonStyle.Cyan]: 'bg-[#34AADC] text-white hover:bg-[#2D99C8]',
  [ButtonStyle.Orange]: 'bg-[#FF9F0A] text-white hover:bg-[#E8900A] shadow-sm hover:shadow-[0_2px_12px_rgba(255,159,10,0.3)]',
  [ButtonStyle.Pink]: 'bg-[#FF375F] text-white hover:bg-[#E53157]',
  [ButtonStyle.Purple]: 'bg-[#BF5AF2] text-white hover:bg-[#AC50DA]',
};

const sizeClasses: Record<ButtonSize, string> = {
  [ButtonSize.Large]: 'h-[50px] text-base px-7',
  [ButtonSize.Medium]: 'h-[42px] text-[15px] px-5',
  [ButtonSize.Small]: 'h-[34px] text-[13px] px-4',
  [ButtonSize.XSmall]: 'h-[26px] text-[11px] px-3',
  [ButtonSize.SquareLarge]: 'w-[50px] h-[50px] text-lg p-0',
  [ButtonSize.SquareMedium]: 'w-[42px] h-[42px] text-base p-0',
  [ButtonSize.SquareSmall]: 'w-[34px] h-[34px] text-sm p-0',
  [ButtonSize.SquareXSmall]: 'w-[26px] h-[26px] text-xs p-0',
};

const shapeClasses: Record<ButtonShape, string> = {
  [ButtonShape.Rectangle]: 'rounded-xl',
  [ButtonShape.Square]: 'rounded-lg',
  [ButtonShape.Pill]: 'rounded-full',
};

export const Button: React.FC<ButtonProps> = ({
  title = '',
  style = ButtonStyle.Primary,
  size = ButtonSize.Medium,
  shape = ButtonShape.Rectangle,
  icon,
  className = '',
  onClick
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    if ('vibrate' in navigator) navigator.vibrate(10);
    setTimeout(() => setIsPressed(false), 100);
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        'relative inline-flex items-center justify-center font-medium cursor-pointer',
        'transition-all duration-150 ease-in-out select-none',
        'focus-visible:outline-2 focus-visible:outline-[#0071E3] focus-visible:outline-offset-2',
        styleClasses[style],
        sizeClasses[size],
        shapeClasses[shape],
        isPressed ? 'scale-[0.97]' : 'scale-100',
        className
      ].join(' ')}
    >
      <span className="flex items-center justify-center gap-1.5">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {title && <span>{title}</span>}
      </span>
    </button>
  );
};

export default Button;