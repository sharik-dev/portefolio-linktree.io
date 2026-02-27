import React from 'react';

interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'small' | 'medium' | 'large';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

const spacingMap = { small: 'gap-2', medium: 'gap-3', large: 'gap-4' };
const alignMap = {
  start: 'items-start justify-start',
  center: 'items-center justify-center',
  end: 'items-end justify-end',
  stretch: 'items-stretch'
};

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'medium',
  align = 'center',
  className = ''
}) => (
  <div className={[
    'flex',
    orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
    spacingMap[spacing],
    alignMap[align],
    className
  ].filter(Boolean).join(' ')}>
    {React.Children.map(children, (child, index) => (
      <div key={index}>{child}</div>
    ))}
  </div>
);

export default ButtonGroup;