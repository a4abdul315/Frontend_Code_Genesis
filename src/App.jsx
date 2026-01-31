import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormWizardProvider, useFormWizard } from './context/FormWizardContext';
import ProgressBar from './components/ProgressBar';
import Step1Form from './components/Step1Form';
import Step2Form from './components/Step2Form';
import Step3Form from './components/Step3Form';
import LanguageSwitcher from './components/LanguageSwitcher';
import { submitApplication } from './services/mockSubmit';

const TOTAL_STEPS = 3;

function WizardContent() {
  const { t } = useTranslation();
  const { formData, resetForm } = useFormWizard();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleFormSubmit = useCallback(async (finalData) => {
    setSubmitting(true);
    setSubmitError(null);
    const payload = finalData ? { ...formData, ...finalData } : formData;
    try {
      await submitApplication(payload);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err?.message || t('errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  }, [formData, t]);

  const handleNewApplication = useCallback(() => {
    resetForm();
    setCurrentStep(1);
    setSubmitted(false);
    setSubmitError(null);
  }, [resetForm]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-emerald-600 dark:text-emerald-400" aria-hidden>✓</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {t('applicationSubmitted')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {t('applicationSubmittedMessage')}
          </p>
          <button
            type="button"
            onClick={handleNewApplication}
            className="px-6 py-2.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            {t('personalInformation')} — {t('language')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t('appTitle')}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('appSubtitle')}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} />
        </div>

        <section
          className="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8"
          aria-labelledby="step-heading"
        >
          <h2 id="step-heading" className="sr-only">
            {currentStep === 1 && t('personalInformation')}
            {currentStep === 2 && t('familyAndFinancial')}
            {currentStep === 3 && t('situationDescriptions')}
          </h2>

          {currentStep === 1 && <Step1Form onNext={handleNext} />}
          {currentStep === 2 && (
            <Step2Form onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 3 && (
            <>
              {submitting && (
                <p className="mb-4 text-slate-600 dark:text-slate-400" role="status" aria-live="polite">
                  {t('generatingSuggestion')}
                </p>
              )}
              {submitError && (
                <p className="mb-4 text-red-600 dark:text-red-400" role="alert">
                  {submitError}
                </p>
              )}
              <Step3Form
                onSubmit={handleFormSubmit}
                onBack={handleBack}
                submitting={submitting}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <FormWizardProvider>
      <WizardContent />
    </FormWizardProvider>
  );
}
