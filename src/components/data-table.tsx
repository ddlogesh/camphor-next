"use client";

import {useRef, useEffect, useCallback, memo, useMemo, Dispatch, SetStateAction} from "react";
import {TabulatorFull as Tabulator, ColumnDefinition, Options} from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import LRUCache from "@/src/lib/lru-cache";
import {LIMIT_ROWS} from "@/src/lib/constants/sql-queries";
import {HeaderRow} from "@/src/types/file-info";

export type DataTableCallbackOptions<T> = {
  lastRow: T | null;
}

type DataTableProps<T> = {
  height: string;
  worksheetId: number;
  columns?: ColumnDefinition[];
  callback: (options: DataTableCallbackOptions<T>) => Promise<T[]>;
  hideHeader?: boolean;
  setHeaderRow?: Dispatch<SetStateAction<HeaderRow | null>>;
  selectable?: boolean;
};

const DataTable = <T extends object,>(props: DataTableProps<T>) => {
  const emptyList = useMemo(() => [], []);
  const {height, worksheetId, columns = emptyList, callback, hideHeader = false, setHeaderRow, selectable = false} = props;

  const tableRef = useRef<HTMLDivElement>(null);
  const tableInstance = useRef<Tabulator>(null);
  const lastRowMap = useRef<Record<number, T | null>>({});
  const pageCache = useRef(new LRUCache<T>(3));

  const initColumns = useCallback((rows: T[]) => {
    const maxCols = Math.max(...rows.map(r => Object.keys(r).length));
    if (tableInstance.current?.getColumnDefinitions().length !== maxCols) {
      const columnDefs: ColumnDefinition[] = [];
      for (let i = 1; i < maxCols; i++) {
        columnDefs.push({
          title: `C${i}`,
          field: `C${i}`,
          cssClass: 'select-none',
        });
      }
      tableInstance.current?.setColumns(columnDefs);
    }
  }, []);

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
    if (tableInstance.current) {
      pageCache.current.clear();
      lastRowMap.current = {};
      (async () => tableInstance.current?.setData() )();
    }
  }, [worksheetId]);

  useEffect(() => {
    if (!tableRef.current) return;

    const options: Options = {
      height,
      columns,
      ajaxRequestFunc,
      ajaxURL: 'any',
      layout: 'fitDataStretch',
      layoutColumnsOnNewData: true,
      progressiveLoad: 'scroll',
      placeholder: 'No rows available',
      headerVisible: !hideHeader,
    }
    if (selectable) {
      options.selectableRows = 1;
      options.rowHeader = {field: 'C0', formatter: 'rowSelection', resizable: false, frozen: true, hozAlign:'center'};
    }
    const table = new Tabulator(tableRef.current, options);
    tableInstance.current = table;
    const cache = pageCache.current;

    table.on('rowSelected', function(row) {
      if (setHeaderRow) setHeaderRow(row.getData() as HeaderRow);
    });

    table.on('rowDeselected', function(_row) {
      if (setHeaderRow) setHeaderRow(null);
    });

    return () => {
      try {
        table.destroy();
        tableInstance.current = null;
      } catch {}
      finally {
        cache.clear();
      }
    };
  }, [ajaxRequestFunc, columns, height, hideHeader, setHeaderRow, selectable]);

  return (
    <div style={{ height, overflow: 'auto' }}>
      <div ref={tableRef} />
    </div>
  );
}

export default memo(DataTable) as typeof DataTable;
