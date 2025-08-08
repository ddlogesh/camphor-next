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

export {
  toPlural,
  parseJSON,
  cn,
  getDatabaseFileName,
};
