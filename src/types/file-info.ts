export type Worksheet = {
  id: number;
  name: string;
}

export interface DataRow {
  rowId: number;
}

export interface WorksheetPreview extends DataRow {
  worksheetId: number;
  rowData: string;
  _rows?: string[];
}

export interface HeaderRow extends DataRow {
  worksheetId: number;
  [key: `C${number}`]: string;
}

export type FileInfo = {
  name: string;
  size: string;
  extension: string;
  file: File;
  worksheetId?: number;
  headerRowId?: number;
  actualHeaders?: string[];
};
