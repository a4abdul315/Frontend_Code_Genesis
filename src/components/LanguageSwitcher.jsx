import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language?.startsWith('ar');

  const toggleLanguage = useCallback(() => {
    const next = i18n.language?.startsWith('ar') ? 'en' : 'ar';
    i18n.changeLanguage(next);
  }, [i18n]);

  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [i18n.language, isRTL]);

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      aria-label={t('language')}
    >
      {isRTL ? t('english') : t('arabic')}
    </button>
  );
}
