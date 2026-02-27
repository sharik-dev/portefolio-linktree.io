import React from 'react';
import './ColorSwatch.css';

interface ColorSwatchProps {
  colorName: string;
  colorValue: string;
  textColor?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  colorName,
  colorValue,
  textColor = 'rgb(248, 248, 242)'
}) => {
  return (
    <div className="color-swatch">
      <div 
        className="color-swatch__color"
        style={{ backgroundColor: colorValue }}
      ></div>
      <div className="color-swatch__info">
        <div className="color-swatch__name" style={{ color: textColor }}>
          {colorName}
        </div>
        <div className="color-swatch__value" style={{ color: textColor }}>
          {colorValue}
        </div>
      </div>
    </div>
  );
};

export default ColorSwatch; 