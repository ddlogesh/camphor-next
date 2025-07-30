import * as Comlink from "comlink";
import ExcelParserModule from "@/public/wasm/excel-parser";
import {EmscriptenModule} from "@/src/types/emscripten-module";
import {Factory, SQLiteAPI} from "@/src/lib/excel-parser/sqlite-api";
import {
  DATABASE_NAME,
  initReadDatabase,
  initWriteDatabase,
  readWorksheet,
} from "@/src/lib/excel-parser/database";
import {AccessHandlePoolVFS} from "@/src/lib/excel-parser/access-handle-pool-vfs";

const FILE_DIRECTORY = '/upload';

export default class ExcelParser {
  wasm: EmscriptenModule | null;

  constructor() {
    this.wasm = null;
  }

  public async load() {
    this.wasm ||= await this.initWasm();
  }

  private async initWasm() {
    if (this.wasm) return this.wasm;

    const wasm: EmscriptenModule = await ExcelParserModule();
    wasm.loadWorksheet = wasm.cwrap<boolean, [string, string]>('load_worksheet', 'boolean', ['string', 'string']);

    const sqliteApi: SQLiteAPI = Factory(wasm);
    const vfs = await AccessHandlePoolVFS.create('.camphor', wasm);
    sqliteApi.vfs_register(vfs, true);

    wasm.writeDB = await initWriteDatabase(sqliteApi);
    wasm.readDB = await initReadDatabase(sqliteApi);
    wasm.sqlite = sqliteApi;

    console.log('WASM initialized');
    return wasm;
  }

  public async fetchWorksheet(file: File) {
    this.wasm ||= await this.initWasm();

    try {
      this.wasm.FS.mkdir(FILE_DIRECTORY);
    } catch {
      // Directory might already exist
    }

    try {
      this.wasm.FS.unmount(FILE_DIRECTORY);
    } catch {
      // Mount point might not exist
    }

    this.wasm.FS.mount(this.wasm.WORKERFS, {files: [file]}, FILE_DIRECTORY);
    const result = this.wasm.loadWorksheet(`${FILE_DIRECTORY}/${file.name}`, DATABASE_NAME);
    if (result) {
      return await readWorksheet(this.wasm.sqlite, this.wasm.readDB);
    } else {
      console.error('Unable to fetch worksheet');
      return [];
    }
  }

  public async close() {
    if (!this.wasm) return;

    await this.wasm.sqlite.close(this.wasm.writeDB);
    await this.wasm.sqlite.close(this.wasm.readDB);
  }
}

Comlink.expose(new ExcelParser());
