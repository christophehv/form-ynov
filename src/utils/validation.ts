// src/utils/validation.ts
export const calculateAge = (dateNaissance: string): number => {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePostalCode = (codePostal: string): boolean => {
    // Format français : 5 chiffres
    const re = /^\d{5}$/;
    return re.test(codePostal);
  };
  
  export const validateName = (name: string): boolean => {
    // Autorise lettres, accents, espaces, apostrophes et tirets
    const re = /^[A-Za-zÀ-ÖØ-öø-ÿ '-]+$/;
    return re.test(name);
  };
  