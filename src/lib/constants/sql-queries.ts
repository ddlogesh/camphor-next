import {ImportField} from "@/src/types/import-config";

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
`;
export const createWorksheetDataTable = (fields: ImportField[]) => {
  const columns = fields.map((field) => {
    const type = getSQLiteFieldType(field);
    const constraints = [
      field.required ? "NOT NULL" : "",
      field.unique ? "UNIQUE" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return `${field.id} ${type}${constraints ? " " + constraints : ""}`;
  });
  columns.unshift("row_id INTEGER PRIMARY KEY AUTOINCREMENT");
  columns.push("row_valid INTEGER NOT NULL DEFAULT 0");
  columns.push("error_data JSON");

  return `CREATE TABLE IF NOT EXISTS worksheet_data (\n\t${columns.join(",\n\t")}\n)`;
}

export const readWorksheet = `SELECT id, name FROM worksheets ORDER BY id ASC LIMIT 200`;
export const countWorksheet = `SELECT COUNT(*) FROM worksheets`;
export const countWorksheetPreview = `SELECT COUNT(*) FROM worksheet_preview`;
export const countWorksheetData = `SELECT COUNT(*) FROM worksheet_data`;

const getSQLiteFieldType = (field: ImportField) => {
  if (field.multi || field.type === 'object') return 'JSON';

  switch (field.type) {
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
