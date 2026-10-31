import type { ReactNode } from "react";

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
}

export default function FieldLabel({
  children,
  required = false,
}: FieldLabelProps) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold text-[#344054]">
      {children}

      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}