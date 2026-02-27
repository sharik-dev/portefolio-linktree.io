import React from 'react';
import ColorSwatch from './ColorSwatch';
import Colors from './Colors';
import './ColorPalette.css';

interface ColorGroupProps {
  title: string;
  colors: Record<string, string>;
}

const ColorGroup: React.FC<ColorGroupProps> = ({ title, colors }) => (
  <div className="color-group">
    <h3 className="color-group__title">{title}</h3>
    <div className="color-group__swatches">
      {Object.entries(colors).map(([name, value]) => (
        <ColorSwatch key={name} colorName={name} colorValue={value} />
      ))}
    </div>
  </div>
);

export const ColorPalette: React.FC = () => {
  const mainColors = {
    primary: Colors.primary,
    secondary: Colors.secondary,
    accent: Colors.accent
  };

  const textColors = {
    textPrimary: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    textTertiary: Colors.textTertiary
  };

  const backgroundColors = {
    backgroundPrimary: Colors.backgroundPrimary,
    backgroundSecondary: Colors.backgroundSecondary,
    backgroundTertiary: Colors.backgroundTertiary
  };

  const stateColors = {
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    info: Colors.info
  };

  const draculaColors = {
    cyan: Colors.cyan,
    orange: Colors.orange,
    pink: Colors.pink,
    purple: Colors.purple,
    red: Colors.red,
    yellow: Colors.yellow
  };

  return (
    <div className="color-palette">
      <h2 className="color-palette__title">Palette de Couleurs Dracula</h2>
      
      <ColorGroup title="Couleurs Principales" colors={mainColors} />
      <ColorGroup title="Couleurs de Texte" colors={textColors} />
      <ColorGroup title="Couleurs de Fond" colors={backgroundColors} />
      <ColorGroup title="Couleurs d'État" colors={stateColors} />
      <ColorGroup title="Couleurs Dracula" colors={draculaColors} />
    </div>
  );
};

export default ColorPalette; 