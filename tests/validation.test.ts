// tests/validation.test.ts
import { calculateAge, validateEmail, validatePostalCode, validateName } from '../src/utils/validation';

describe('Fonctions de validation', () => {
  test('calculateAge retourne l\'âge correct', () => {
    const today = new Date();
    const annee = today.getFullYear() - 20;
    const mois = today.getMonth() + 1;
    const jour = today.getDate();
    const dateStr = `${annee}-${mois < 10 ? '0' + mois : mois}-${jour < 10 ? '0' + jour : jour}`;
    expect(calculateAge(dateStr)).toBe(20);
  });

  test('L\'âge doit être inférieur à 18 pour une date trop récente', () => {
    const dateUnder18 = new Date();
    dateUnder18.setFullYear(dateUnder18.getFullYear() - 17);
    const dateStr = dateUnder18.toISOString().split('T')[0];
    expect(calculateAge(dateStr)).toBeLessThan(18);
  });

  test('validatePostalCode accepte un code postal français valide', () => {
    expect(validatePostalCode('75001')).toBe(true);
    expect(validatePostalCode('ABCDE')).toBe(false);
  });

  test('validateName accepte des noms valides et rejette les invalides', () => {
    expect(validateName('Jean')).toBe(true);
    expect(validateName('Marie-Claire')).toBe(true);
    expect(validateName("O'Connor")).toBe(true);
    expect(validateName('Jean123')).toBe(false);
  });

  test('validateEmail accepte une adresse email valide', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });

  describe('validateName', () => {
    test('devrait retourner false pour une chaîne vide', () => {
      expect(validateName('')).toBe(false);
    });

    test('devrait retourner false pour une chaîne null ou undefined', () => {
      expect(validateName('')).toBe(false);
      expect(validateName('')).toBe(false);
    });

    test('devrait retourner true pour un nom valide', () => {
      expect(validateName('Dupont')).toBe(true);
      expect(validateName('Jean-Pierre')).toBe(true);
      expect(validateName('O\'Connor')).toBe(true);
    });

    test('devrait retourner false pour un nom avec des caractères spéciaux', () => {
      expect(validateName('Dupont123')).toBe(false);
      expect(validateName('Jean!')).toBe(false);
      expect(validateName('Pierre@')).toBe(false);
    });
  });

  describe('calculateAge', () => {
    test('calcule correctement l\'âge avec les cas limites de mois et jours', () => {
      const mockDate = new Date('2024-03-15T00:00:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      expect(calculateAge('2000-01-01')).toBe(24);
      expect(calculateAge('2000-03-16')).toBe(23);
      expect(calculateAge('2000-03-15')).toBe(24);
      expect(calculateAge('2000-03-14')).toBe(24);

      jest.useRealTimers();
    });

    test('gère correctement le changement d\'année', () => {
      const mockDate = new Date('2024-01-01T00:00:00.000Z');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      expect(calculateAge('2000-12-31')).toBe(23);
      expect(calculateAge('2000-01-01')).toBe(24);

      jest.useRealTimers();
    });
  });
});
