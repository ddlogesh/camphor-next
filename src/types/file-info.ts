export type Worksheet = {
  id: number;
  name: string;
}

export type WorksheetPreview = {
  worksheetId: number;
  rowId: number;
  rowData: string;
  _rows?: string[];
}

export type HeaderRow = {
  [key: `C${number}`]: string;
}

export type FileInfo = {
  name: string;
  size: string;
  extension: string;
  file: File;
  worksheetId?: number;
  headerRowId?: number;
  headerRow?: HeaderRow;
};
