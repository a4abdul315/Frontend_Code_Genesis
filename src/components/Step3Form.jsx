import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormWizard } from '../context/FormWizardContext';
import { generateSuggestion } from '../services/openai';
import AISuggestionModal from './AISuggestionModal';

const FIELDS = [
  { name: 'currentFinancialSituation', labelKey: 'currentFinancialSituation', placeholderKey: 'placeholderFinancial', contextKey: 'current financial situation' },
  { name: 'employmentCircumstances', labelKey: 'employmentCircumstances', placeholderKey: 'placeholderEmployment', contextKey: 'employment circumstances' },
  { name: 'reasonForApplying', labelKey: 'reasonForApplying', placeholderKey: 'placeholderReason', contextKey: 'reason for applying' },
];

export default function Step3Form({ onSubmit: onFormSubmit, onBack, submitting = false }) {
  const { t } = useTranslation();
  const { formData, setFormData } = useFormWizard();
  const isRTL = document.documentElement.dir === 'rtl';

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState('idle'); // idle | loading | success | error
  const [modalSuggestion, setModalSuggestion] = useState('');
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [activeField, setActiveField] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      currentFinancialSituation: formData.currentFinancialSituation,
      employmentCircumstances: formData.employmentCircumstances,
      reasonForApplying: formData.reasonForApplying,
    },
  });

  const handleHelpMeWrite = useCallback(
    async (field) => {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey || apiKey.trim() === '') {
        setModalErrorMessage(t('noApiKey'));
        setModalStatus('error');
        setModalOpen(true);
        return;
      }
      setActiveField(field);
      setModalStatus('loading');
      setModalSuggestion('');
      setModalErrorMessage('');
      setModalOpen(true);

      const currentValue = watch(field.name);
      const userPrompt = currentValue?.trim() || `I need help describing my ${field.contextKey} for a social support application.`;

      try {
        const { text } = await generateSuggestion(userPrompt, field.contextKey);
        setModalSuggestion(text);
        setModalStatus('success');
      } catch (err) {
        let message;
        if (err.message === 'TIMEOUT') {
          message = t('timeoutError');
        } else if (err.message === 'NO_API_KEY') {
          message = t('noApiKey');
        } else if (err?.message && err.message !== '') {
          message = err.message;
        } else {
          message = t('errorGeneric');
        }
        setModalErrorMessage(message);
        setModalStatus('error');
      }
    },
    [t, watch]
  );

  const handleAcceptSuggestion = useCallback(() => {
    if (activeField && modalSuggestion) {
      setValue(activeField.name, modalSuggestion);
    }
    setModalOpen(false);
    setActiveField(null);
  }, [activeField, modalSuggestion, setValue]);

  const handleEditSuggestion = useCallback(() => {
    if (activeField && modalSuggestion) {
      setValue(activeField.name, modalSuggestion);
    }
    setModalOpen(false);
    setActiveField(null);
  }, [activeField, modalSuggestion, setValue]);

  const onCloseModal = useCallback(() => {
    setModalOpen(false);
    setActiveField(null);
  }, []);

  const onSubmit = (data) => {
    setFormData(data);
    onFormSubmit(data);
  };

  const textareaBase =
    'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-[120px] resize-y';
  const textareaClass = (hasError) =>
    hasError
      ? `${textareaBase} border-red-500 dark:border-red-500`
      : `${textareaBase} border-slate-300 dark:border-slate-600`;
  const errorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

  const MIN_DESCRIPTION_LENGTH = 20;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {FIELDS.map((field) => (
          <div key={field.name}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <label htmlFor={field.name} className={labelClass}>
                {t(field.labelKey)}
              </label>
              <button
                type="button"
                onClick={() => handleHelpMeWrite(field)}
                className="self-start sm:self-center px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                {t('helpMeWrite')}
              </button>
            </div>
            <textarea
              id={field.name}
              {...register(field.name, {
                required: t('required'),
                minLength: {
                  value: MIN_DESCRIPTION_LENGTH,
                  message: t('minDescription', { min: MIN_DESCRIPTION_LENGTH }),
                },
                maxLength: {
                  value: 2000,
                  message: t('maxCharacters', { max: 2000 }),
                },
              })}
              placeholder={t(field.placeholderKey)}
              className={textareaClass(!!errors[field.name])}
              rows={4}
              aria-invalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
            {errors[field.name] && (
              <p id={`${field.name}-error`} className={errorClass} role="alert">
                {errors[field.name].message}
              </p>
            )}
          </div>
        ))}

        <div className={`pt-4 flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            {t('back')}
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {t('submitApplication')}
          </button>
        </div>
      </form>

      <AISuggestionModal
        isOpen={modalOpen}
        onClose={onCloseModal}
        suggestion={modalSuggestion}
        status={modalStatus}
        errorMessage={modalErrorMessage}
        onAccept={handleAcceptSuggestion}
        onEdit={handleEditSuggestion}
        onDiscard={onCloseModal}
      />
    </>
  );
}
