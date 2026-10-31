import type { ReactNode } from 'react';

export type TableAction = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'olive' | 'green' | 'orange' | 'blue' | 'red' | 'neutral';
  disabled?: boolean;
};

type TableActionsProps = {
  actions: TableAction[];
  className?: string;
};

const variantStyles: Record<
  NonNullable<TableAction['variant']>,
  {
    container: string;
    icon: string;
  }
> = {
  olive: {
    container:
      'border-[#dce5ce] bg-[#f3f7ed] text-[#52692e] hover:bg-[#eaf1df]',
    icon: 'bg-[#e5edd9] text-[#52692e]',
  },
  green: {
    container:
      'border-[#dcebd2] bg-[#f3f9ee] text-[#39743a] hover:bg-[#eaf5e2]',
    icon: 'bg-[#e4f5d9] text-[#37813a]',
  },
  orange: {
    container:
      'border-[#ffdbb8] bg-[#fff4e9] text-[#b45309] hover:bg-[#ffead5]',
    icon: 'bg-[#ffe5cc] text-[#c45a0b]',
  },
  blue: {
    container:
      'border-[#cfe2fb] bg-[#f2f8ff] text-[#2865a5] hover:bg-[#e8f2ff]',
    icon: 'bg-[#e0edff] text-[#347ee0]',
  },
  red: {
    container:
      'border-[#f5d6d6] bg-[#fff4f4] text-[#c24141] hover:bg-[#ffe8e8]',
    icon: 'bg-[#ffe5e5] text-[#c24141]',
  },
  neutral: {
    container:
      'border-[#e1e5dd] bg-white text-[#58614f] hover:bg-[#f7f8f4]',
    icon: 'bg-[#f0f2ed] text-[#65715b]',
  },
};

export default function TableActions({
  actions,
  className = '',
}: TableActionsProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 xl:ml-4 xl:border-l xl:border-[#e7ebe4] xl:pl-4 ${className}`}
    >
      {actions.map((action) => {
        const styles = variantStyles[action.variant ?? 'neutral'];

        return (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className={`inline-flex h-[42px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-[12px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[145px] sm:flex-none ${styles.container}`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full ${styles.icon}`}
            >
              {action.icon}
            </span>

            {action.label}
          </button>
        );
      })}
    </div>
  );
}