"use client";

import {useRef, useEffect, useCallback, memo, Dispatch, SetStateAction} from "react";
import {TabulatorFull as Tabulator, ColumnDefinition, Options, RowComponent} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import LRUCache from "@/src/lib/lru-cache";
import {LIMIT_ROWS} from "@/src/lib/constants/sql-queries";
import {DataRow} from "@/src/types/file-info";

export type DataTableCallbackOptions<T> = {
  lastRow: T | null;
}

type DataTableProps<T> = {
  height: string;
  columns: ColumnDefinition[];
  callback: (options: DataTableCallbackOptions<T>) => Promise<T[]>;
  hideHeader?: boolean;
  selectRow?: string | number;
  setSelectedRow?: Dispatch<SetStateAction<T | null>>;
  selectable?: boolean;
  rowIndex?: string;
  metadata?: { [key: string]: string | number | undefined };
};

const DataTable = <T extends DataRow, >(props: DataTableProps<T>) => {
  const {
    height,
    columns,
    callback,
    hideHeader = false,
    selectRow,
    setSelectedRow,
    selectable = false,
    rowIndex = 'rowId',
    metadata = {}
  } = props;

  const tableRef = useRef<HTMLDivElement>(null);
  const tableInstance = useRef<Tabulator>(null);
  const lastRowMap = useRef<Record<number, T | null>>({});
  const pageCache = useRef(new LRUCache<T>(3));

  const defineColumns = useCallback((rows: T[]) => {
    if (!tableInstance.current) return;

    const maxCols = Math.max(...rows.map(r => Object.keys(r).length));
    const columnDefs = structuredClone(columns);
    const diff = maxCols - columnDefs.length;
    if (diff > 0) {
      for (let i = 1; i <= diff; i++) {
        columnDefs.push({
          title: `C${i}`,
          field: `C${i}`,
          cssClass: selectable ? 'select-none' : undefined,
        });
      }
      tableInstance.current.setColumns(columnDefs);
    }
  }, [columns, selectable]);

  const scrollRow = useCallback(async () => {
    if (!selectRow || !tableInstance.current) return;

    // Rewriting findRow implementation to avoid console warnings for invalid row index
    const rawRow = tableInstance.current.rowManager.findRow(selectRow);
    if (!rawRow) return;

    const row: RowComponent = rawRow.getComponent();
    await row.scrollTo('nearest');
  }, [selectRow]);

  const ajaxRequestFunc = useCallback(async (_url: string, _config: unknown, params: Record<string, number>) => {
    const {page} = params;
    const prevPage = page - 1;

    const cached = pageCache.current.get(page);
    if (cached) {
      return {
        data: cached,
        last_page: cached.length === LIMIT_ROWS ? page + 1 : page,
      };
    }

    const lastRow = prevPage > 0 ? lastRowMap.current[prevPage] ?? null : null;
    const rows = await callback({lastRow});
    pageCache.current.set(page, rows);
    if (rows.length > 0) {
      lastRowMap.current[page] = rows[rows.length - 1];
      if (hideHeader) defineColumns(rows);
    }

    return {
      data: rows,
      last_page: rows.length === LIMIT_ROWS ? page + 1 : page,
    };
  }, [callback, hideHeader, defineColumns]);

  const rowFormatter = useCallback((row: RowComponent) => {
    if (row.getIndex() === selectRow && !row.isSelected()) row.select();
  }, [selectRow]);

  useEffect(() => {
    if (!tableInstance.current) return;

    if (metadata.worksheetId) {
      pageCache.current.clear();
      lastRowMap.current = {};
      tableInstance.current.setData().then(() => scrollRow());
    }
  }, [metadata, scrollRow]);

  useEffect(() => {
    if (!tableRef.current) return;

    const options: Options = {
      height,
      columns,
      rowFormatter,
      ajaxRequestFunc,
      ajaxURL: 'any',
      index: rowIndex,
      layout: 'fitDataStretch',
      layoutColumnsOnNewData: true,
      progressiveLoad: 'scroll',
      placeholder: 'No rows available',
      headerVisible: !hideHeader,
      selectableRows: selectable ? 1 : undefined,
    }
    const table = new Tabulator(tableRef.current, options);
    tableInstance.current = table;
    const cache = pageCache.current;

    table.on('rowSelectionChanged', (rows: T[]) => setSelectedRow?.(rows[0]));
    table.on('tableBuilt', () => scrollRow());

    return () => {
      try {
        table.destroy();
        tableInstance.current = null;
      } catch {
      } finally {
        cache.clear();
      }
    };
  }, [ajaxRequestFunc, columns, height, hideHeader, setSelectedRow, selectable, rowIndex, scrollRow, rowFormatter]);

  return (
    <div style={{height, overflow: 'auto'}}>
      <div ref={tableRef}/>
    </div>
  );
}

export default memo(DataTable) as typeof DataTable;
