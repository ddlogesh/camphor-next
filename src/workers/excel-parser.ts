import * as Comlink from "comlink";
import ExcelParserModule from "@/public/wasm/excel-parser";
import {EmscriptenModule} from "@/src/types/emscripten-module";
import {ImportConfig} from "@/src/types/import-config";
import {Factory, SQLiteAPI} from "@/src/lib/excel-parser/sqlite-api";
import {AccessHandlePoolVFS} from "@/src/lib/excel-parser/access-handle-pool-vfs";
import {initReadDB, initWriteDB, readWorksheet} from "@/src/lib/excel-parser/database";
import {getDatabaseFileName} from "@/src/lib/utils";

const FILE_DIRECTORY = '/upload';

export default class ExcelParser {
  wasm: EmscriptenModule | null;

  constructor() {
    this.wasm = null;
  }

  public async loadWasm(importConfig: ImportConfig | null = null) {
    this.wasm ||= await this.initWasm();

    if (importConfig)
      this.wasm.imports[importConfig.id] ||= await this.initDatabase(importConfig);
  }

  public async fetchWorksheet(file: File, importConfig: ImportConfig) {
    this.wasm ||= await this.getWasm(importConfig);

    const {id: importId} = importConfig;
    const {FS, WORKERFS, sqlite, imports} = this.wasm;
    const {readDB} = imports[importId];

    try {
      FS.mkdir(FILE_DIRECTORY);
    } catch {
      // Directory might already exist
    }

    try {
      FS.unmount(FILE_DIRECTORY);
    } catch {
      // Mount point might not exist
    }

    FS.mount(WORKERFS, {files: [file]}, FILE_DIRECTORY);
    const result = this.wasm.loadWorksheet(`${FILE_DIRECTORY}/${file.name}`, getDatabaseFileName(importId));
    if (result) {
      return await readWorksheet(sqlite, readDB);
    } else {
      console.error('Unable to fetch worksheet');
      return [];
    }
  }

  public async close() {
    if (!this.wasm) return;

    const {imports, sqlite} = this.wasm;

    while (Object.keys(imports).length > 0) {
      const [importId, {readDB, writeDB}] = Object.entries(imports)[0];

      await Promise.all([
        sqlite.close(readDB),
        sqlite.close(writeDB),
      ]);

      delete imports[importId];
    }
  }

  private async initWasm() {
    if (this.wasm) return this.wasm;

    const wasm: EmscriptenModule = await ExcelParserModule();
    wasm.loadWorksheet = wasm.cwrap<boolean, [string, string]>('load_worksheet', 'boolean', ['string', 'string']);

    const sqliteApi: SQLiteAPI = Factory(wasm);
    const vfs = await AccessHandlePoolVFS.create('.camphor', wasm);
    sqliteApi.vfs_register(vfs, true);
    wasm.sqlite = sqliteApi;
    wasm.imports = {};

    console.log('WASM initialized');
    return wasm;
  }

  private async getWasm(importConfig: ImportConfig) {
    await this.loadWasm(importConfig);
    return this.wasm as EmscriptenModule;
  }

  private async initDatabase(importConfig: ImportConfig) {
    this.wasm ||= await this.initWasm();

    const {id: importId} = importConfig;
    const {imports, sqlite} = this.wasm;

    const database = imports[importId];
    if (database) return database;

    const writeDB = await initWriteDB(sqlite, importConfig);
    const readDB = await initReadDB(sqlite, importConfig);

    console.log(`DB initialized for ${importId}`);
    return {
      writeDB,
      readDB,
    }
  }
}

Comlink.expose(new ExcelParser());
