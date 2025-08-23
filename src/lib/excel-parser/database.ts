import {SQLiteAPI} from "@/src/lib/excel-parser/sqlite-api";
import * as SQLiteQuery from "@/src/lib/constants/sql-queries";
import * as SQLite from "@/src/lib/constants/sql-codes";
import {getDatabaseFileName} from "@/src/lib/utils";
import {HeaderRow, Worksheet, WorksheetPreview} from "@/src/types/file-info";
import {ImportConfig} from "@/src/types/import-config";

const initReadDB = async (sqlite: SQLiteAPI, importConfig: ImportConfig) => {
  const databaseFileName = getDatabaseFileName(importConfig.id);
  const db: number = await sqlite.open_v2(databaseFileName, SQLite.SQLITE_OPEN_READONLY);
  // Testing DB read connection
  await Promise.all([
    sqlite.exec(db, SQLiteQuery.countWorksheet),
    sqlite.exec(db, SQLiteQuery.countWorksheetPreview),
    sqlite.exec(db, SQLiteQuery.countWorksheetData),
  ]);
  return db;
}

const initWriteDB = async (sqlite: SQLiteAPI, importConfig: ImportConfig) => {
  const {id: importId, fields} = importConfig;
  const databaseFileName = getDatabaseFileName(importId);
  const db: number = await sqlite.open_v2(databaseFileName, SQLite.SQLITE_OPEN_READWRITE | SQLite.SQLITE_OPEN_CREATE);
  await Promise.all([
    sqlite.exec(db, SQLiteQuery.createWorksheetTable),
    sqlite.exec(db, SQLiteQuery.createWorksheetPreviewTable),
    sqlite.exec(db, SQLiteQuery.createWorksheetDataTable(fields)),
  ]);
  return db;
}

const listWorksheetNames = async (sqlite: SQLiteAPI, db: number) => {
  const worksheets: Worksheet[] = [];
  if (!db) return worksheets;

  await sqlite.exec(db, SQLiteQuery.readWorksheet, (row) => {
    worksheets.push({
      id: row[0] as number,
      name: row[1] as string,
    });
  });
  return worksheets;
}

const listHeaderRows = async (sqlite: SQLiteAPI, db: number) => {
  const previews: WorksheetPreview[] = [];
  if (!db) return previews;

  const options = {rowId: 1, limit: SQLiteQuery.LIMIT_SHEETS};
  await sqlite.exec(db, SQLiteQuery.readWorksheetPreview(options), (row) => {
    const rowData = row[2] as string;
    previews.push({
      worksheetId: row[0] as number,
      rowId: row[1] as number,
      rowData,
      _rows: rowData.split('\x1F'),
    });
  });
  return previews;
}

const listWorksheetPreviews = async (sqlite: SQLiteAPI, db: number, options: {sheetId?: number, rowId?: number, limit?: number}) => {
  const headers: HeaderRow[] = [];
  if (!db) return headers;

  options.limit ||= SQLiteQuery.LIMIT_ROWS;
  await sqlite.exec(db, SQLiteQuery.readWorksheetPreview(options), (row) => {
    const worksheetId = row[0] as number;
    const rowId = row[1] as number;
    const cells: HeaderRow = {
      worksheetId,
      rowId,
      C0: `${worksheetId}:${rowId}`,
    };
    const rowCols = (row[2] as string).split('\x1F');
    for (let i = 0; i < rowCols.length; i++) cells[`C${i + 1}`] = rowCols[i];
    headers.push(cells);
  });
  return headers;
}

export {
  initReadDB,
  initWriteDB,
  listWorksheetNames,
  listHeaderRows,
  listWorksheetPreviews,
};
