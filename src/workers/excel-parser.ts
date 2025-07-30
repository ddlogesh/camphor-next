import * as Comlink from "comlink";
import parseExcelModule from "@/public/wasm/parseExcel";
import {AccessHandlePoolVFS} from "@/src/lib/access-handle-pool-vfs";
import {Factory, SQLiteAPI, SQLiteError} from "@/src/lib/sqlite-api";
import {EmscriptenModule} from "@/src/types/emscripten-module";
import * as SQLite from "@/src/types/sql-constants";

const DATABASE_NAME = 'main.db';
const FILE_DIRECTORY = '/upload';
const SAMPLE_USERS = [
  {id: 1, name: "Logesh Johnson"},
  {id: 2, name: "Bob Smith"},
  {id: 3, name: "Charlie Brown"},
  {id: 4, name: "Diana Wilson"},
  {id: 5, name: "Edward Davis"}
];

export default class ExcelParser {
  wasm: EmscriptenModule | null;
  sqlite: SQLiteAPI | null;
  readDB: number;
  writeDB: number;
  initialized: boolean;

  constructor() {
    this.wasm = null;
    this.sqlite = null;
    this.readDB = 0;
    this.writeDB = 0;
    this.initialized = false;
  }

  public async init() {
    if (this.initialized) return;

    this.wasm ||= await parseExcelModule();
    this.sqlite ||= await this.initSQLite();
    this.writeDB ||= await this.initWriteDatabase();
    this.readDB ||= await this.initReadDatabase();
    this.initialized = true;
    console.log('WASM initialized');
  }

  public async mountFile(file: File) {
    if (!this.initialized) await this.init();
    if (!this.wasm) return;

    try {
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
      await this.listWorksheets(`${FILE_DIRECTORY}/${file.name}`);

      return {status: 'mounted', filename: file.name};
    } catch (error) {
      console.error('Error mounting file:', error);
      return {status: 'error', filename: file.name};
    }
  }

  private async listWorksheets(filePath: string) {
    if (!this.initialized) await this.init();
    if (!this.wasm) return;

    try {
      const getWorksheetNames = this.wasm.cwrap<null, [string, string]>('getWorksheetNames', null, ['string', 'string']);
      getWorksheetNames(filePath, DATABASE_NAME);
    } catch (error) {
      console.error('Error listing worksheets:', error);
    }
  }

  private async initSQLite() {
    if (!this.wasm) return null;

    const sqliteApi: SQLiteAPI = Factory(this.wasm);
    const vfs = await AccessHandlePoolVFS.create('.camphor', this.wasm);
    sqliteApi.vfs_register(vfs, true);
    console.log('SQLite initialized');
    return sqliteApi;
  }

  private async initReadDatabase() {
    if (!this.sqlite) return 0;

    const db: number = await this.sqlite.open_v2(DATABASE_NAME, SQLite.SQLITE_OPEN_READONLY);
    const countUserSQL = `SELECT COUNT(*)
                          FROM users`;
    await this.sqlite.exec(db, countUserSQL, (row) => {
      console.log(`Retrieved ${row} users`);
    });
    return db;
  }

  private async initWriteDatabase() {
    if (!this.sqlite) return 0;

    const db: number = await this.sqlite.open_v2(DATABASE_NAME, SQLite.SQLITE_OPEN_READWRITE | SQLite.SQLITE_OPEN_CREATE);
    const createUserSQL = `
        CREATE TABLE IF NOT EXISTS users
        (
            id
            INTEGER
            PRIMARY
            KEY
            AUTOINCREMENT,
            name
            TEXT
            NOT
            NULL
        )
    `;
    await this.sqlite.exec(db, createUserSQL);

    const insertUserSQL = `INSERT INTO users (id, name)
                           VALUES (?, ?)`;
    for await (const stmt of this.sqlite.statements(db, insertUserSQL)) {
      for (const user of SAMPLE_USERS) {
        try {
          this.sqlite.bind(stmt, 1, user.id);
          this.sqlite.bind(stmt, 2, user.name);
          await this.sqlite.step(stmt);
        } catch (error) {
          if (error instanceof SQLiteError) {
            console.error(`SQLite error: ${error.code} - ${error.message}`);
          }
        } finally {
          try {
            await this.sqlite.reset(stmt);
          } catch {
            // Ignore reset errors
          }
        }
      }
      await this.sqlite.finalize(stmt);
    }

    return db;
  }

  public async close() {
    await this.sqlite?.close(this.writeDB);
    await this.sqlite?.close(this.readDB);
  }
}

Comlink.expose(new ExcelParser());
