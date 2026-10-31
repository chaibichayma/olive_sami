import {
  AllCommunityModule,
  type ColDef,
  themeQuartz,
} from "ag-grid-community";

import { AgGridProvider, AgGridReact } from "ag-grid-react";

interface DataTableProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  defaultColDef?: ColDef<T>;
  rowHeight?: number;
  headerHeight?: number;
  getRowId?: (params: { data: T }) => string;
  emptyMessage?: string;
  onGridReady?: (event: any) => void;
}

const tableTheme = themeQuartz.withParams({
  accentColor: "#556B2F",
  borderColor: "#E5E7EB",
  headerBackgroundColor: "#F8FAFC",
  headerTextColor: "#475569",
  foregroundColor: "#334155",
  fontFamily: "Inter, sans-serif",
  fontSize: 13,
  rowHoverColor: "#F8FAF5",
  spacing: 8,
});

export function DataTable<T>({
  rowData,
  columnDefs,
  defaultColDef,
  rowHeight = 58,
  headerHeight = 50,
  getRowId,
  onGridReady,
}: DataTableProps<T>) {
  return (
    <div
      className="w-full"
      style={{
        height: `${Math.max(1, rowData.length) * rowHeight + headerHeight}px`,
      }}
    >
      <AgGridProvider modules={[AllCommunityModule]}>
        <AgGridReact<T>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          theme={tableTheme}
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          animateRows
          suppressCellFocus
          getRowId={getRowId}
          onGridReady={onGridReady}
          localeText={{
            page: "Page",
            more: "Plus",
            to: "à",
            of: "sur",
            next: "Suivant",
            last: "Dernier",
            first: "Premier",
            previous: "Précédent",
            loadingOoo: "Chargement...",
            noRowsToShow: "Aucun résultat trouvé",
            pageSizeSelectorLabel: "Lignes par page",
            filterOoo: "Filtrer...",
            equals: "Égal à",
            notEqual: "Différent de",
            contains: "Contient",
            notContains: "Ne contient pas",
            startsWith: "Commence par",
            endsWith: "Se termine par",
            lessThan: "Inférieur à",
            greaterThan: "Supérieur à",
            andCondition: "ET",
            orCondition: "OU",
            applyFilter: "Appliquer",
            resetFilter: "Réinitialiser",
            clearFilter: "Effacer",
          }}
        />
      </AgGridProvider>
    </div>
  );
}