import { Check } from "lucide-react";

export interface FormStep {
  title: string;
  description: string;
}

interface FormStepIndicatorProps {
  steps: FormStep[];
  activeStep?: number;
}

export function FormStepIndicator({
  steps,
  activeStep = 1,
}: FormStepIndicatorProps) {
  return (
    <section
      aria-label="Étapes du formulaire"
      className="mb-5 rounded-2xl border border-[#E7EBF0] bg-white px-4 py-4 shadow-sm sm:px-7"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_40px_1fr_40px_1fr] sm:items-center">
        {steps.map((step, index) => {
          const number = index + 1;
          const active = number <= activeStep;

          return (
            <div key={step.title} className="contents">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    active
                      ? "border-[#556B2F] bg-[#556B2F] text-white"
                      : "border-[#E4E9EF] bg-[#F2F4F7] text-[#8491A4]"
                  }`}
                >
                  {number < activeStep ? (
                    <Check className="size-4" />
                  ) : (
                    number
                  )}
                </div>

                <div className="min-w-0">
                  <p className={`truncate text-xs font-bold ${active ? "text-[#263449]" : "text-[#75839A]"}`}>
                    {step.title}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-[#93A0B2]">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden border-t border-dashed border-[#D6DEE8] sm:block" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}