import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormWizard } from '../context/FormWizardContext';

export default function Step1Form({ onNext }) {
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
      name: formData.name,
      nationalId: formData.nationalId,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
    },
  });

  const onSubmit = (data) => {
    setFormData(data);
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

  const validateDobNotFuture = (value) => {
    if (!value) return true;
    return new Date(value) <= new Date() || t('dateInFuture');
  };
  const phonePattern = /^[\d\s+\-()]{8,20}$/;
  const nationalIdPattern = /^[a-zA-Z0-9\-]{5,20}$/;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelClass}>
            {t('fullName')}
          </label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: t('required'),
              minLength: { value: 2, message: t('minCharacters', { min: 2 }) },
              maxLength: { value: 100, message: t('maxCharacters', { max: 100 }) },
            })}
            className={inputClass(!!errors.name)}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className={errorClass} role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="nationalId" className={labelClass}>
            {t('nationalId')}
          </label>
          <input
            id="nationalId"
            type="text"
            {...register('nationalId', {
              required: t('required'),
              minLength: { value: 5, message: t('invalidNationalId') },
              maxLength: { value: 20, message: t('invalidNationalId') },
              pattern: { value: nationalIdPattern, message: t('invalidNationalId') },
            })}
            className={inputClass(!!errors.nationalId)}
            aria-invalid={!!errors.nationalId}
            aria-describedby={errors.nationalId ? 'nationalId-error' : undefined}
          />
          {errors.nationalId && (
            <p id="nationalId-error" className={errorClass} role="alert">
              {errors.nationalId.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="dob" className={labelClass}>
            {t('dateOfBirth')}
          </label>
          <input
            id="dob"
            type="date"
            {...register('dob', {
              required: t('required'),
              validate: validateDobNotFuture,
            })}
            className={inputClass(!!errors.dob)}
            aria-invalid={!!errors.dob}
            aria-describedby={errors.dob ? 'dob-error' : undefined}
          />
          {errors.dob && (
            <p id="dob-error" className={errorClass} role="alert">
              {errors.dob.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="gender" className={labelClass}>
            {t('gender')}
          </label>
          <select
            id="gender"
            {...register('gender', { required: t('required') })}
            className={inputClass(!!errors.gender)}
            aria-invalid={!!errors.gender}
            aria-describedby={errors.gender ? 'gender-error' : undefined}
          >
            <option value="">{isRTL ? '— اختر —' : '— Select —'}</option>
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
            <option value="other">{t('other')}</option>
          </select>
          {errors.gender && (
            <p id="gender-error" className={errorClass} role="alert">
              {errors.gender.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="address" className={labelClass}>
          {t('address')}
        </label>
        <input
          id="address"
          type="text"
          {...register('address', {
            required: t('required'),
            minLength: { value: 5, message: t('minCharacters', { min: 5 }) },
            maxLength: { value: 200, message: t('maxCharacters', { max: 200 }) },
          })}
          className={inputClass(!!errors.address)}
          autoComplete="street-address"
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? 'address-error' : undefined}
        />
        {errors.address && (
          <p id="address-error" className={errorClass} role="alert">
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className={labelClass}>
            {t('city')}
          </label>
          <input
            id="city"
            type="text"
            {...register('city', {
              required: t('required'),
              minLength: { value: 2, message: t('minCharacters', { min: 2 }) },
              maxLength: { value: 50, message: t('maxCharacters', { max: 50 }) },
            })}
            className={inputClass(!!errors.city)}
            autoComplete="address-level2"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city && (
            <p id="city-error" className={errorClass} role="alert">
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="state" className={labelClass}>
            {t('state')}
          </label>
          <input
            id="state"
            type="text"
            {...register('state', { maxLength: { value: 50, message: t('maxCharacters', { max: 50 }) } })}
            className={inputClass(!!errors.state)}
            autoComplete="address-level1"
          />
        </div>
        <div>
          <label htmlFor="country" className={labelClass}>
            {t('country')}
          </label>
          <input
            id="country"
            type="text"
            {...register('country', {
              required: t('required'),
              minLength: { value: 2, message: t('minCharacters', { min: 2 }) },
              maxLength: { value: 50, message: t('maxCharacters', { max: 50 }) },
            })}
            className={inputClass(!!errors.country)}
            autoComplete="country-name"
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? 'country-error' : undefined}
          />
          {errors.country && (
            <p id="country-error" className={errorClass} role="alert">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className={labelClass}>
            {t('phone')}
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone', {
              required: t('required'),
              minLength: { value: 8, message: t('invalidPhone') },
              maxLength: { value: 20, message: t('invalidPhone') },
              pattern: { value: phonePattern, message: t('invalidPhone') },
            })}
            className={inputClass(!!errors.phone)}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className={errorClass} role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: t('required'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('invalidEmail'),
              },
              maxLength: { value: 100, message: t('maxCharacters', { max: 100 }) },
            })}
            className={inputClass(!!errors.email)}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className={errorClass} role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className={`pt-4 flex ${isRTL ? 'flex-row-reverse' : ''}`}>
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
