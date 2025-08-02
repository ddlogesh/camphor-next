export const ExcelParserWorker = () => {
  return new Worker(new URL("excel-parser.ts", import.meta.url), { type: "module" });
}
