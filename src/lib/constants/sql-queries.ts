export const createWorksheetTable = `
  CREATE TABLE IF NOT EXISTS worksheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );
`;
export const readWorksheet = `SELECT id, name FROM worksheets ORDER BY id ASC LIMIT 200`;
export const countWorksheet = `SELECT COUNT(*) FROM worksheets`;
