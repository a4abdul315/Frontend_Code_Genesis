import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormWizard } from '../context/FormWizardContext';

export default function Step2Form({ onNext, onBack }) {
  const { t } = useTranslation();
  const { formData, setFormData } = useFormWizard();
  const isRTL = document.documentElement.dir === 'rtl';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      maritalStatus: formData.maritalStatus,
      dependents: formData.dependents ?? 0,
      employmentStatus: formData.employmentStatus,
      monthlyIncome: formData.monthlyIncome,
      housingStatus: formData.housingStatus,
    },
  });

  const onSubmit = (data) => {
    setFormData({
      ...data,
      dependents: Number(data.dependents) || 0,
    });
    onNext();
  };

  const inputBase =
    'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent';
  const inputClass = (hasError) =>
    hasError
      ? `${inputBase} border-red-500 dark:border-red-500`
      : `${inputBase} border-slate-300 dark:border-slate-600`;
  const errorClass = 'mt-1 text-sm text-red-600 dark:text-red-400';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="maritalStatus" className={labelClass}>
          {t('maritalStatus')}
        </label>
        <select
          id="maritalStatus"
          {...register('maritalStatus', { required: t('required') })}
          className={inputClass(!!errors.maritalStatus)}
          aria-invalid={!!errors.maritalStatus}
          aria-describedby={errors.maritalStatus ? 'maritalStatus-error' : undefined}
        >
          <option value="">{isRTL ? '— اختر —' : '— Select —'}</option>
          <option value="single">{t('single')}</option>
          <option value="married">{t('married')}</option>
          <option value="divorced">{t('divorced')}</option>
          <option value="widowed">{t('widowed')}</option>
        </select>
        {errors.maritalStatus && (
          <p id="maritalStatus-error" className={errorClass} role="alert">
            {errors.maritalStatus.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="dependents" className={labelClass}>
          {t('numberOfDependents')}
        </label>
        <input
          id="dependents"
          type="number"
          min={0}
          max={20}
          {...register('dependents', {
            required: t('required'),
            valueAsNumber: true,
            min: { value: 0, message: t('minValue', { min: 0 }) },
            max: { value: 20, message: t('maxValue', { max: 20 }) },
            validate: (v) => !Number.isNaN(v) || t('mustBeNumber'),
          })}
          className={inputClass(!!errors.dependents)}
          aria-invalid={!!errors.dependents}
          aria-describedby={errors.dependents ? 'dependents-error' : undefined}
        />
        {errors.dependents && (
          <p id="dependents-error" className={errorClass} role="alert">
            {errors.dependents.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="employmentStatus" className={labelClass}>
          {t('employmentStatus')}
        </label>
        <select
          id="employmentStatus"
          {...register('employmentStatus', { required: t('required') })}
          className={inputClass(!!errors.employmentStatus)}
          aria-invalid={!!errors.employmentStatus}
          aria-describedby={errors.employmentStatus ? 'employmentStatus-error' : undefined}
        >
          <option value="">{isRTL ? '— اختر —' : '— Select —'}</option>
          <option value="employed">{t('employed')}</option>
          <option value="unemployed">{t('unemployed')}</option>
          <option value="self">{t('selfEmployed')}</option>
          <option value="student">{t('student')}</option>
          <option value="retired">{t('retired')}</option>
        </select>
        {errors.employmentStatus && (
          <p id="employmentStatus-error" className={errorClass} role="alert">
            {errors.employmentStatus.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="monthlyIncome" className={labelClass}>
          {t('monthlyIncome')}
        </label>
        <input
          id="monthlyIncome"
          type="text"
          {...register('monthlyIncome', {
            required: t('required'),
            minLength: { value: 1, message: t('required') },
            maxLength: { value: 50, message: t('maxCharacters', { max: 50 }) },
          })}
          className={inputClass(!!errors.monthlyIncome)}
          placeholder={isRTL ? 'مثال: 0، 1500، غير مستقر' : 'e.g. 0, 1500, unstable'}
          aria-invalid={!!errors.monthlyIncome}
          aria-describedby={errors.monthlyIncome ? 'monthlyIncome-error' : undefined}
        />
        {errors.monthlyIncome && (
          <p id="monthlyIncome-error" className={errorClass} role="alert">
            {errors.monthlyIncome.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="housingStatus" className={labelClass}>
          {t('housingStatus')}
        </label>
        <select
          id="housingStatus"
          {...register('housingStatus', { required: t('required') })}
          className={inputClass(!!errors.housingStatus)}
          aria-invalid={!!errors.housingStatus}
          aria-describedby={errors.housingStatus ? 'housingStatus-error' : undefined}
        >
          <option value="">{isRTL ? '— اختر —' : '— Select —'}</option>
          <option value="own">{t('own')}</option>
          <option value="rent">{t('renting')}</option>
          <option value="family">{t('withFamily')}</option>
          <option value="other">{t('other')}</option>
        </select>
        {errors.housingStatus && (
          <p id="housingStatus-error" className={errorClass} role="alert">
            {errors.housingStatus.message}
          </p>
        )}
      </div>

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
          className="px-6 py-2.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          {t('next')}
        </button>
      </div>
    </form>
  );
}
