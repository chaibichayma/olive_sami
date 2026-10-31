interface ExportColumn<T> {
  label: string;
  value: (item: T) => string | number;
}

interface ExportToCsvOptions<T> {
  filename: string;
  data: T[];
  columns: ExportColumn<T>[];
}

export function exportToCsv<T>({
  filename,
  data,
  columns,
}: ExportToCsvOptions<T>) {
  const escapeCsv = (value: string | number) =>
    `"${String(value ?? '').replace(/"/g, '""')}"`;

  const rows = [
    columns.map((column) => escapeCsv(column.label)).join(';'),

    ...data.map((item) =>
      columns
        .map((column) => escapeCsv(column.value(item)))
        .join(';'),
    ),
  ];

  const content = '\uFEFF' + rows.join('\r\n');

  const blob = new Blob([content], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}