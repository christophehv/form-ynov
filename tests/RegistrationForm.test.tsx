// tests/RegistrationForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from '../src/components/RegistrationForm';
import '@testing-library/jest-dom';

describe('Composant RegistrationForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Le bouton est désactivé si les champs ne sont pas remplis', () => {
    render(<RegistrationForm />);
    const button = screen.getByRole('button', { name: /sauvegarder/i });
    expect(button).toBeDisabled();
  });

  test('Sauvegarde complète dans le localStorage', () => {
    render(<RegistrationForm />);

    // Données de test
    const testData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      ville: 'Paris',
      codePostal: '75001',
    };

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: testData.nom },
    });
    fireEvent.change(screen.getByLabelText('Prénom'), {
      target: { value: testData.prenom },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: testData.email },
    });

    // Date de naissance (20 ans)
    const date = new Date();
    date.setFullYear(date.getFullYear() - 20);
    const dateStr = date.toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText('Date de naissance'), {
      target: { value: dateStr },
    });

    fireEvent.change(screen.getByLabelText('Ville'), {
      target: { value: testData.ville },
    });
    fireEvent.change(screen.getByLabelText('Code Postal'), {
      target: { value: testData.codePostal },
    });

    // Soumettre le formulaire
    const form = screen.getByRole('button', { name: /sauvegarder/i }).closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    // Vérifier le localStorage
    const storedData = JSON.parse(localStorage.getItem('userRegistration') || '{}');
    
    // Vérifier chaque champ individuellement
    expect(storedData.nom).toBe(testData.nom);
    expect(storedData.prenom).toBe(testData.prenom);
    expect(storedData.email).toBe(testData.email);
    expect(storedData.dateNaissance).toBe(dateStr);
    expect(storedData.ville).toBe(testData.ville);
    expect(storedData.codePostal).toBe(testData.codePostal);

    // Vérifier que le toaster de succès est affiché
    expect(screen.getByText(/enregistrement réussi/i)).toBeInTheDocument();

    // Vérifier que les champs sont vidés
    expect(screen.getByLabelText('Nom')).toHaveValue('');
    expect(screen.getByLabelText('Prénom')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Date de naissance')).toHaveValue('');
    expect(screen.getByLabelText('Ville')).toHaveValue('');
    expect(screen.getByLabelText('Code Postal')).toHaveValue('');
  });

  test("Affichage du toaster d'erreur et des messages d'erreur en rouge pour des champs invalides", async () => {
    render(<RegistrationForm />);
  
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Dupont123' },
    });
    fireEvent.change(screen.getByLabelText('Prénom'), {
      target: { value: 'Jean!' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' },
    });
  
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16);
    const dateStr = date.toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText('Date de naissance'), {
      target: { value: dateStr },
    });
  
    fireEvent.change(screen.getByLabelText('Ville'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Code Postal'), {
      target: { value: 'ABCDE' },
    });
  
    const form = screen.getByRole('button', { name: /sauvegarder/i }).closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);
  
    await waitFor(() => {
      expect(screen.getByText(/erreur dans le formulaire/i)).toBeInTheDocument();
    });
  
    // Utiliser getAllByText pour les messages qui peuvent apparaître plusieurs fois
    const erreurNom = screen.getAllByText(/nom invalide/i);
    expect(erreurNom.length).toBeGreaterThan(0);
    expect(erreurNom[0]).toBeInTheDocument();

    expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    expect(screen.getByText(/vous devez avoir au moins 18 ans/i)).toBeInTheDocument();
    expect(screen.getByText(/la ville est requise/i)).toBeInTheDocument();
    expect(screen.getByText(/code postal invalide/i)).toBeInTheDocument();
  });

  test('Réinitialisation des erreurs lors de la modification des champs', async () => {
    render(<RegistrationForm />);
    
    // Remplir tous les champs avec des valeurs invalides
    const nomInput = screen.getByLabelText('Nom');
    fireEvent.change(nomInput, { target: { value: 'Dupont123' } });
    
    const form = screen.getByRole('button', { name: /sauvegarder/i }).closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);
    
    // Attendre que le message d'erreur apparaisse
    await waitFor(() => {
      expect(screen.getByText(/nom invalide/i)).toBeInTheDocument();
    });
    
    // Corriger la valeur du champ
    fireEvent.change(nomInput, { target: { value: 'Dupont' } });
    
    // Vérifier que TOUS les messages d'erreur ont disparu
    await waitFor(() => {
      expect(screen.queryByText(/nom invalide/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/prénom invalide/i)).not.toBeInTheDocument();
    });
  });

  test('Validation individuelle de chaque champ du formulaire', () => {
    render(<RegistrationForm />);
    
    // Remplir tous les champs avec des valeurs valides
    fireEvent.change(screen.getByLabelText('Nom'), { 
      target: { value: 'Dupont' } 
    });
    fireEvent.change(screen.getByLabelText('Prénom'), { 
      target: { value: 'Jean' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'jean.dupont@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Ville'), { 
      target: { value: 'Paris' } 
    });
    fireEvent.change(screen.getByLabelText('Code Postal'), { 
      target: { value: '75001' } 
    });

    const date = new Date();
    date.setFullYear(date.getFullYear() - 19);
    fireEvent.change(screen.getByLabelText('Date de naissance'), {
      target: { value: date.toISOString().split('T')[0] }
    });

    // Vérifier qu'il n'y a pas de messages d'erreur
    expect(screen.queryByText(/invalide/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sauvegarder/i })).not.toBeDisabled();
  });

  test('Gestion du localStorage et réinitialisation du formulaire après succès', async () => {
    render(<RegistrationForm />);
    
    fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean.dupont@example.com' } });
    fireEvent.change(screen.getByLabelText('Ville'), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByLabelText('Code Postal'), { target: { value: '75001' } });

    const date = new Date();
    date.setFullYear(date.getFullYear() - 20);
    fireEvent.change(screen.getByLabelText('Date de naissance'), {
      target: { value: date.toISOString().split('T')[0] }
    });

    const form = screen.getByRole('button', { name: /sauvegarder/i }).closest('form');
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('userRegistration') || '{}');
      expect(stored.nom).toBe('Dupont');
      expect(stored.email).toBe('jean.dupont@example.com');
    });

    expect(screen.getByLabelText('Nom')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByText(/enregistrement réussi/i)).toBeInTheDocument();
  });
});
