import type { InputHTMLAttributes, ReactNode } from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
  inputClassName?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'className'
>;

export default function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  icon,
  className = '',
  inputClassName = '',
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-semibold text-[#485440]"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#849176]">
            {icon}
          </span>
        )}

        <input
          {...inputProps}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={`h-[35px] w-full rounded-lg border bg-white text-[11px] text-[#34412b] outline-none transition placeholder:text-[#92998c] focus:ring-2 focus:ring-[#586f32]/10 ${
            error
              ? 'border-red-300 focus:border-red-400'
              : 'border-[#e1e5dd] focus:border-[#82965e]'
          } ${icon ? 'pl-9 pr-3' : 'px-3'} ${inputClassName}`}
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-[10px] text-red-600"
        >
          {error}
        </p>
      )}

      {!error && hint && (
        <p
          id={`${id}-hint`}
          className="mt-1 text-[10px] text-[#92998c]"
        >
          {hint}
        </p>
      )}
    </div>
  );
}