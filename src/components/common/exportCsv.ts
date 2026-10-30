
interface ExportCsvOptions<T> {
  data: T[];
  headers: string[];
  mapRow: (item: T) => (string | number)[];
  filename: string;
}

export function exportCsv<T>({
  data,
  headers,
  mapRow,
  filename,
}: ExportCsvOptions<T>) {
  const escapeValue = (value: string | number) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const rows = data.map(mapRow);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeValue).join(";"))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
