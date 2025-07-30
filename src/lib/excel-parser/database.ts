import {SQLiteAPI} from "@/src/lib/excel-parser/sqlite-api";
import * as SQLiteQuery from "@/src/lib/constants/sql-queries";
import * as SQLite from "@/src/lib/constants/sql-codes";
import {Worksheet} from "@/src/types/file-info";

export const DATABASE_NAME = 'main.db';

const initReadDatabase = async (sqlite: SQLiteAPI) => {
  const db: number = await sqlite.open_v2(DATABASE_NAME, SQLite.SQLITE_OPEN_READONLY);
  await sqlite.exec(db, SQLiteQuery.countWorksheet); // Testing DB read connection
  return db;
}

const initWriteDatabase = async (sqlite: SQLiteAPI) => {
  const db: number = await sqlite.open_v2(DATABASE_NAME, SQLite.SQLITE_OPEN_READWRITE | SQLite.SQLITE_OPEN_CREATE);
  await sqlite.exec(db, SQLiteQuery.createWorksheetTable);
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
  initReadDatabase,
  initWriteDatabase,
  readWorksheet,
};
