import {ImportField} from "@/src/types/import-config";

type SQLiteFieldType = 'TEXT' | 'NUMERIC' | 'JSON';

export const LIMIT_ROWS = 50;
export const LIMIT_SHEETS = 200;

export const createWorksheetTable = `
  CREATE TABLE IF NOT EXISTS worksheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`;
export const createWorksheetPreviewTable = `
  CREATE TABLE IF NOT EXISTS worksheet_preview (
    worksheet_id INTEGER NOT NULL,
    row_id INTEGER NOT NULL,
    row_data TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_ws_preview_ws_row ON worksheet_preview (worksheet_id, row_id);
`;
export const createWorksheetDataTable = (fields: ImportField[]) => {
  const columns = fields.map((field) => {
    const {id, required, unique} = field;
    const type = getSQLiteFieldType(field);
    const constraints = [
      required ? "NOT NULL" : "", // Add DEFAULT NULL in else condition if prepared statement insertion fails
      unique ? "UNIQUE" : "",
    ].filter(Boolean).join(" ");

    return `${id.toLowerCase()} ${type}${constraints ? " " + constraints : ""}`;
  });
  columns.unshift("row_id INTEGER PRIMARY KEY AUTOINCREMENT");
  columns.push("row_valid INTEGER NOT NULL DEFAULT 0");
  columns.push("error_data JSON");

  return `CREATE TABLE IF NOT EXISTS worksheet_data (\n\t${columns.join(",\n\t")}\n)`;
}

export const readWorksheet = `SELECT id, name FROM worksheets ORDER BY id ASC LIMIT ${LIMIT_SHEETS}`;
export const readWorksheetPreview = (options: {sheetId?: number, rowId?: number, limit?: number}) => {
  const {sheetId = -1, rowId = -1, limit = LIMIT_ROWS} = options;
  let query = `SELECT worksheet_id, row_id, row_data FROM worksheet_preview `;
  if (sheetId > 0) {
    query += `WHERE worksheet_id = ${sheetId} `;
    if (rowId > 0) query += `AND row_id > ${rowId} `;
  } else if (rowId > 0) query += `WHERE row_id = ${rowId} `;
  query += `ORDER BY worksheet_id ASC, row_id ASC LIMIT ${limit}`;
  return query;
};
export const countWorksheet = `SELECT COUNT(*) FROM worksheets`;
export const countWorksheetPreview = `SELECT COUNT(*) FROM worksheet_preview`;
export const countWorksheetData = `SELECT COUNT(*) FROM worksheet_data`;

const getSQLiteFieldType = (field: ImportField): SQLiteFieldType => {
  const {type, multi} = field;
  if (multi || type === 'object') return 'JSON';

  switch (type) {
    case 'string':
    case 'long_text':
    case 'datetime':
    case 'date':
    case 'time':
      return 'TEXT';
    case 'select':
    case 'number':
    case 'float':
    case 'bool':
    default:
      return 'NUMERIC';
  }
}
