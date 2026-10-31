
interface ColorPickerProps {
  value: string;
  colors: string[];
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({
  value,
  colors,
  onChange,
  label = "Couleur",
}: ColorPickerProps) {
  return (
    <div>
      <p className="mb-2.5 text-sm font-semibold text-slate-700">
        {label}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Choisir la couleur ${color}`}
            aria-pressed={value === color}
            onClick={() => onChange(color)}
            className="flex size-9 items-center justify-center rounded-full border-2 transition"
            style={{
              borderColor: value === color ? color : "transparent",
            }}
          >
            <span
              className="size-5 rounded-full"
              style={{ backgroundColor: color }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
