export interface CsvColumn<T> {
  header: string;
  accessor: (item: T) => string | number | null | undefined;
}

interface ExportCsvOptions<T> {
  data: T[];
  columns: CsvColumn<T>[];
  filename: string;
}

export function exportCsv<T>({
  data,
  columns,
  filename,
}: ExportCsvOptions<T>) {
  const escapeCsv = (value: string | number | null | undefined) =>
    `"${String(value ?? '').replace(/"/g, '""')}"`;

  const headers = columns
    .map((column) => escapeCsv(column.header))
    .join(';');

  const rows = data.map((item) =>
    columns
      .map((column) => escapeCsv(column.accessor(item)))
      .join(';'),
  );

  const csvContent = [headers, ...rows].join('\n');

  const blob = new Blob(
    ['\uFEFF' + csvContent],
    { type: 'text/csv;charset=utf-8;' },
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename.endsWith('.csv')
    ? filename
    : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}