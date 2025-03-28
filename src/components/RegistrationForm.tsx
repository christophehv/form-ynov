import { useState, ChangeEvent, FormEvent } from 'react';
import { validateEmail, validatePostalCode, validateName, calculateAge } from '../utils/validation';
import Toaster from './Toaster';

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string;
  ville: string;
  codePostal: string;
}

interface Errors {
  [key: string]: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    ville: '',
    codePostal: ''
  });

  const [errors, setErrors] = useState<Errors>({});
  const [toaster, setToaster] = useState<{ message: string; type?: 'success' | 'error' }>({ message: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const isFormComplete = (): boolean => {
    return Object.values(formData).every(val => val.trim() !== '');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentErrors: Errors = {};

    if (!validateName(formData.nom)) {
      currentErrors.nom = 'Nom invalide';
    }
    if (!validateName(formData.prenom)) {
      currentErrors.prenom = 'Prénom invalide';
    }
    if (!validateEmail(formData.email)) {
      currentErrors.email = 'Email invalide';
    }
    if (!formData.dateNaissance || calculateAge(formData.dateNaissance) < 18) {
      currentErrors.dateNaissance = 'Vous devez avoir au moins 18 ans';
    }
    if (!formData.ville) {
      currentErrors.ville = 'La ville est requise';
    }
    if (!validatePostalCode(formData.codePostal)) {
      currentErrors.codePostal = 'Code postal invalide';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setToaster({ message: 'Erreur dans le formulaire', type: 'error' });
      return;
    }

    localStorage.setItem('userRegistration', JSON.stringify(formData));
    setToaster({ message: 'Enregistrement réussi', type: 'success' });

    setFormData({
      nom: '',
      prenom: '',
      email: '',
      dateNaissance: '',
      ville: '',
      codePostal: ''
    });
    setErrors({});
  };

  return (
    <div>
      {toaster.message && toaster.type && (
        <div role="alert">
          <Toaster message={toaster.message} type={toaster.type} />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Nom</label>
          <input id="nom" name="nom" value={formData.nom} onChange={handleChange} />
          {errors.nom && <div style={{ color: 'red' }}>{errors.nom}</div>}
        </div>

        <div>
          <label htmlFor="prenom">Prénom</label>
          <input id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} />
          {errors.prenom && <div style={{ color: 'red' }}>{errors.prenom}</div>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </div>

        <div>
          <label htmlFor="dateNaissance">Date de naissance</label>
          <input
            id="dateNaissance"
            name="dateNaissance"
            type="date"
            value={formData.dateNaissance}
            onChange={handleChange}
          />
          {errors.dateNaissance && <div style={{ color: 'red' }}>{errors.dateNaissance}</div>}
        </div>

        <div>
          <label htmlFor="ville">Ville</label>
          <input id="ville" name="ville" value={formData.ville} onChange={handleChange} />
          {errors.ville && <div style={{ color: 'red' }}>{errors.ville}</div>}
        </div>

        <div>
          <label htmlFor="codePostal">Code Postal</label>
          <input id="codePostal" name="codePostal" value={formData.codePostal} onChange={handleChange} />
          {errors.codePostal && <div style={{ color: 'red' }}>{errors.codePostal}</div>}
        </div>

        <button type="submit" disabled={!isFormComplete()}>
          Sauvegarder
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
