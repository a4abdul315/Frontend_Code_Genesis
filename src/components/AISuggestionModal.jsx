import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';

export default function AISuggestionModal({
  isOpen,
  onClose,
  suggestion,
  status, // 'idle' | 'loading' | 'success' | 'error'
  errorMessage,
  onAccept,
  onEdit,
  onDiscard,
}) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const previousActive = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    previousActive.current = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      previousActive.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isRTL = document.documentElement.dir === 'rtl';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
      aria-describedby="ai-modal-desc"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700"
      >
        <h2 id="ai-modal-title" className="text-lg font-semibold p-4 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          {t('aiSuggestion')}
        </h2>
        <div id="ai-modal-desc" className="p-4 overflow-y-auto flex-1">
          {status === 'loading' && (
            <p className="text-slate-600 dark:text-slate-400">{t('generatingSuggestion')}</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 dark:text-red-400">{errorMessage || t('errorGeneric')}</p>
          )}
          {status === 'success' && suggestion && (
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{suggestion}</p>
          )}
        </div>
        <div className={`p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {status === 'success' && (
            <>
              <button
                type="button"
                onClick={onAccept}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {t('accept')}
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="flex-1 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                {t('editAndUse')}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              onDiscard?.();
              onClose();
            }}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            {t('discard')}
          </button>
        </div>
      </div>
    </div>
  );
}
