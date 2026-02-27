import React from 'react';
import Button, { ButtonStyle, ButtonSize, ButtonShape } from './Button';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';

// Exemple simple d'icône utilisant SVG
const ExampleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ButtonExample: React.FC = () => {
  return (
    <div className="button-examples">
      <h2>Exemples de Boutons</h2>
      
      <h3>Styles de Boutons</h3>
      <ButtonGroup spacing="small">
        <Button title="Primaire" style={ButtonStyle.Primary} onClick={() => console.log('Primaire')} />
        <Button title="Secondaire" style={ButtonStyle.Secondary} onClick={() => console.log('Secondaire')} />
        <Button title="Tertiaire" style={ButtonStyle.Tertiary} onClick={() => console.log('Tertiaire')} />
      </ButtonGroup>
      
      <h3>Tailles de Boutons</h3>
      <ButtonGroup spacing="small">
        <Button title="Grand" size={ButtonSize.Large} onClick={() => console.log('Grand')} />
        <Button title="Moyen" size={ButtonSize.Medium} onClick={() => console.log('Moyen')} />
        <Button title="Petit" size={ButtonSize.Small} onClick={() => console.log('Petit')} />
        <Button title="Très Petit" size={ButtonSize.XSmall} onClick={() => console.log('Très Petit')} />
      </ButtonGroup>
      
      <h3>Formes de Boutons</h3>
      <ButtonGroup spacing="small">
        <Button title="Rectangle" shape={ButtonShape.Rectangle} onClick={() => console.log('Rectangle')} />
        <Button title="Pill" shape={ButtonShape.Pill} onClick={() => console.log('Pill')} />
      </ButtonGroup>
      
      <h3>Boutons avec Icône</h3>
      <ButtonGroup spacing="small">
        <Button title="Avec Icône" icon={<ExampleIcon />} onClick={() => console.log('Avec Icône')} />
        <Button title="Succès" style={ButtonStyle.Success} icon={<ExampleIcon />} onClick={() => console.log('Succès')} />
        <Button title="Erreur" style={ButtonStyle.Error} icon={<ExampleIcon />} onClick={() => console.log('Erreur')} />
      </ButtonGroup>
      
      <h3>Boutons Icône</h3>
      <ButtonGroup spacing="small">
        <IconButton icon={<ExampleIcon />} onClick={() => console.log('Icône Medium')} ariaLabel="Ajouter" />
        <IconButton icon={<ExampleIcon />} size={ButtonSize.SquareLarge} onClick={() => console.log('Icône Large')} ariaLabel="Ajouter" />
        <IconButton icon={<ExampleIcon />} size={ButtonSize.SquareSmall} onClick={() => console.log('Icône Small')} ariaLabel="Ajouter" />
        <IconButton icon={<ExampleIcon />} style={ButtonStyle.Secondary} onClick={() => console.log('Icône Secondaire')} ariaLabel="Ajouter" />
      </ButtonGroup>
      
      <h3>Groupe de Boutons Vertical</h3>
      <ButtonGroup orientation="vertical" spacing="medium">
        <Button title="Premier" onClick={() => console.log('Premier')} />
        <Button title="Deuxième" onClick={() => console.log('Deuxième')} style={ButtonStyle.Secondary} />
        <Button title="Troisième" onClick={() => console.log('Troisième')} style={ButtonStyle.Tertiary} />
      </ButtonGroup>
      
      <h3>Styles Colorés</h3>
      <ButtonGroup spacing="small">
        <Button title="Success" style={ButtonStyle.Success} onClick={() => console.log('Success')} />
        <Button title="Warning" style={ButtonStyle.Warning} onClick={() => console.log('Warning')} />
        <Button title="Error" style={ButtonStyle.Error} onClick={() => console.log('Error')} />
        <Button title="Info" style={ButtonStyle.Info} onClick={() => console.log('Info')} />
      </ButtonGroup>
      
      <ButtonGroup spacing="small">
        <Button title="Cyan" style={ButtonStyle.Cyan} onClick={() => console.log('Cyan')} />
        <Button title="Orange" style={ButtonStyle.Orange} onClick={() => console.log('Orange')} />
        <Button title="Pink" style={ButtonStyle.Pink} onClick={() => console.log('Pink')} />
        <Button title="Purple" style={ButtonStyle.Purple} onClick={() => console.log('Purple')} />
      </ButtonGroup>
    </div>
  );
};

export default ButtonExample; 