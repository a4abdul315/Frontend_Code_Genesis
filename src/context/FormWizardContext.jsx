import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';

const STORAGE_KEY = 'social-support-application-form';

const defaultValues = {
  // Step 1
  name: '',
  nationalId: '',
  dob: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  email: '',
  // Step 2
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: '',
  housingStatus: '',
  // Step 3
  currentFinancialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultValues;
    const parsed = JSON.parse(raw);
    return { ...defaultValues, ...parsed };
  } catch {
    return defaultValues;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save form to localStorage', e);
  }
}

const FormWizardContext = createContext(null);

export function FormWizardProvider({ children }) {
  const [formData, setFormDataState] = useState(loadFromStorage);

  useEffect(() => {
    saveToStorage(formData);
  }, [formData]);

  const setFormData = useCallback((updates) => {
    setFormDataState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormDataState(defaultValues);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ formData, setFormData, resetForm, defaultValues }),
    [formData, setFormData, resetForm]
  );

  return (
    <FormWizardContext.Provider value={value}>
      {children}
    </FormWizardContext.Provider>
  );
}

export function useFormWizard() {
  const ctx = useContext(FormWizardContext);
  if (!ctx) throw new Error('useFormWizard must be used within FormWizardProvider');
  return ctx;
}
