import type { ReactNode } from "react";

interface FormSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  color?: "green" | "amber" | "blue";
}

const colors = {
  green: "bg-[#F0F4E9] text-[#556B2F]",
  amber: "bg-[#FFF7E7] text-[#D97706]",
  blue: "bg-[#EEF5FF] text-[#3478F6]",
};

export function FormSection({
  icon,
  title,
  description,
  children,
  color = "green",
}: FormSectionProps) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}>
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#202D43]">{title}</h3>
          <p className="mt-1 text-[11px] leading-5 text-[#8A98AD]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}