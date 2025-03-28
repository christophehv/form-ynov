// src/App.tsx
import React from 'react';
import RegistrationForm from './components/RegistrationForm';

const App: React.FC = () => {
  return (
    <div>
      <h1>Formulaire d'enregistrement</h1>
      <RegistrationForm />
    </div>
  );
};

export default App;
