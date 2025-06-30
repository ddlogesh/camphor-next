export type ImportConfig = {
  id: string;
  label: string;
  fields: ImportField[];
}

export type ImportField = {
  id: string;
  type: string;
  format?: string;
  enum?: { id: string; label: string }[];
  required?: boolean;
  unique?: boolean;
  min?: number;
  max?: number;
  fixed?: number;
  length?: number;
  multi?: boolean;
  fields?: ImportField[];
};

export type ImportFieldOptions = {
  serializeObject?: boolean;
};
