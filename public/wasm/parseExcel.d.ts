import {EmscriptenModule} from '@/src/types/emscripten-module';

declare module '@/public/wasm/parseExcel' {
  export default function parseExcelModule(): Promise<EmscriptenModule>;
}
