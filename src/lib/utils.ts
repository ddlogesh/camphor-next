import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {Stage} from "@/src/types/global";
import {ImportField} from "@/src/types/import-config";
import {ImporterError} from "@/src/lib/exceptions/importer-error";

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

const nextStage = (expectedList: ImportField[], actualList: string[]): Stage => {
  const actualSet = new Set<string>();
  for (const actual of actualList) {
    const field = actual.trim().toLowerCase();
    if (field) actualSet.add(field);
  }

  let candidateCount = actualSet.size;
  let missingRequired = 0;
  let mismatches = 0;

  for (const expected of expectedList) {
    const field = expected.id.trim().toLowerCase();
    if (actualSet.has(field)) candidateCount--;
    else {
      mismatches++;
      if (expected.required) missingRequired++;
    }
  }

  if (missingRequired > candidateCount) throw new ImporterError('Missing required fields');
  if (mismatches > 0 && candidateCount > 0) return 'map';
  return 'validate';
}

export {
  toPlural,
  parseJSON,
  cn,
  getDatabaseFileName,
  nextStage,
};
