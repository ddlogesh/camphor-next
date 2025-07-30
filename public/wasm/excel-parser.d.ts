import {EmscriptenModule} from '@/src/types/emscripten-module';

declare module '@/public/wasm/excel-parser' {
  export default function ExcelParserModule(): Promise<EmscriptenModule>;
}
