import {SQLiteAPI} from "@/src/lib/excel-parser/sqlite-api";
import * as SQLiteQuery from "@/src/lib/constants/sql-queries";
import * as SQLite from "@/src/lib/constants/sql-codes";
import {getDatabaseFileName} from "@/src/lib/utils";
import {Worksheet} from "@/src/types/file-info";
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

const readWorksheet = async (sqlite: SQLiteAPI, db: number) => {
  const worksheets: Worksheet[] = [];
  await sqlite.exec(db, SQLiteQuery.readWorksheet, (row) => {
    worksheets.push({
      id: row[0] as string,
      name: row[1] as string,
    });
  });
  return worksheets;
}

export {
  initReadDB,
  initWriteDB,
  readWorksheet,
};
