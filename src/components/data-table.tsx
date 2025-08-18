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

  const initColumns = useCallback((rows: T[]) => {
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

  const findRow = (index: string | number): RowComponent | undefined => {
    if (!tableInstance.current) return;

    const row = tableInstance.current.rowManager.findRow(index);
    if (!row) return;

    return row.getComponent();
  }

  const scrollAndSelectRow = useCallback(() => {
    if (!selectRow) return;

    const row = findRow(selectRow);
    if (!row) return;

    row.scrollTo('nearest').then(() => row.select());
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
      if (hideHeader) initColumns(rows);
    }

    return {
      data: rows,
      last_page: rows.length === LIMIT_ROWS ? page + 1 : page,
    };
  }, [callback, hideHeader, initColumns]);

  useEffect(() => {
    if (!tableInstance.current) return;

    if (metadata.worksheetId) {
      pageCache.current.clear();
      lastRowMap.current = {};
      tableInstance.current.setData().then(() => scrollAndSelectRow());
    }
  }, [metadata, scrollAndSelectRow]);

  useEffect(() => {
    if (!tableRef.current) return;

    const options: Options = {
      height,
      columns,
      ajaxRequestFunc,
      index: rowIndex,
      ajaxURL: 'any',
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

    table.on('rowSelected', (row) => setSelectedRow?.(row.getData() as T));
    table.on('rowDeselected', (_row) => setSelectedRow?.(null));
    table.on('tableBuilt', () => scrollAndSelectRow());

    return () => {
      try {
        table.destroy();
        tableInstance.current = null;
      } catch {
      } finally {
        cache.clear();
      }
    };
  }, [ajaxRequestFunc, columns, height, hideHeader, setSelectedRow, selectable, rowIndex, scrollAndSelectRow]);

  return (
    <div style={{height, overflow: 'auto'}}>
      <div ref={tableRef}/>
    </div>
  );
}

export default memo(DataTable) as typeof DataTable;
