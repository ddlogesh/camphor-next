export type Worksheet = {
  id: string;
  name: string;
}

export type FileInfo = {
  name: string;
  size: string;
  extension: string;
  file: File;
  worksheets?: Worksheet[];
  worksheetId?: string;
};
