import { useTranslation } from 'react-i18next';

const STEPS = [
  { key: 'step1', labelKey: 'personalInformation' },
  { key: 'step2', labelKey: 'familyAndFinancial' },
  { key: 'step3', labelKey: 'situationDescriptions' },
];

export default function ProgressBar({ currentStep }) {
  const { t } = useTranslation();
  const stepIndex = Math.max(0, Math.min(currentStep - 1, STEPS.length - 1));

  return (
    <nav
      className="w-full"
      aria-label="Application progress"
      role="navigation"
    >
      <ol className="flex items-center justify-between gap-2 w-full" role="list">
        {STEPS.map((step, index) => {
          const isActive = index === stepIndex;
          const isCompleted = index < stepIndex;
          return (
            <li
              key={step.key}
              className="flex-1 flex flex-col items-center"
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div
                    className={`flex-1 h-1 rounded transition-colors ${isCompleted ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    aria-hidden
                  />
                )}
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm
                    transition-colors
                    ${isCompleted ? 'bg-emerald-600 text-white' : ''}
                    ${isActive ? 'bg-sky-600 text-white ring-4 ring-sky-200 dark:ring-sky-900' : ''}
                    ${!isCompleted && !isActive ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400' : ''}
                  `}
                >
                  {isCompleted ? (
                    <span aria-hidden>✓</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 rounded transition-colors ${isCompleted ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    aria-hidden
                  />
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium text-center max-w-[120px]
                  ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}
                `}
              >
                {t(step.labelKey)}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
