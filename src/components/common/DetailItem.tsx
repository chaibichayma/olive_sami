interface DetailItemProps {
  label: string;
  value: string;
}

export default function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <div className="rounded-lg border border-[#e8ede3] bg-[#fbfcfa] p-3">
      <p className="text-[10px] font-medium text-[#7b8795]">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold text-[#344054]">
        {value}
      </p>
    </div>
  );
}