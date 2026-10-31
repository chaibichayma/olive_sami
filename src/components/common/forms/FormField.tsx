import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  icon?: ReactNode;
  unit?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  icon,
  unit,
  hint,
  required = true,
  children,
}: FormFieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#243047]"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="group relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 flex -translate-y-1/2 items-center text-[#8A9BB5] group-focus-within:text-[#556B2F]">
            {icon}
          </span>
        )}

        {children}

        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-[#F5F7FA] px-2.5 py-1 text-[11px] font-semibold text-[#64748B]">
            {unit}
          </span>
        )}
      </div>

      {hint && (
        <p className="mt-1.5 text-[11px] leading-5 text-[#8998AD]">
          {hint}
        </p>
      )}
    </div>
  );
}