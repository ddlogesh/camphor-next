import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const toPlural = (text: string, count: number) => {
  return `${text}${count === 1 ? '' : 's'}`;
}

const parseJSON = (value: string, fallback: string | null = null) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const getDatabaseFileName = (importId: string) => {
  return `import_${importId.toLowerCase()}.db`;
}

const normalizeDupFields = (fields: string[]): string[] => {
  const seen: Record<string, number> = {};
  return fields.map(field => {
    field ||= 'Blank';
    seen[field] = (seen[field] || 0) + 1;
    return seen[field] === 1 ? field : `${field}_${seen[field]}`;
  });
}

const setToMap = (fields: Set<string>) => {
  const map: Record<string, string> = {};
  for (const field of fields) map[field] = field;
  return map;
}

export {
  toPlural,
  parseJSON,
  cn,
  getDatabaseFileName,
  normalizeDupFields,
  setToMap,
};
