import {EmscriptenModule} from "@/src/types/emscripten-module";
import {FacadeVFS} from "@/src/lib/facade-vfs";

type SQLiteCompatibleType = number | string | Uint8Array | Array<number> | bigint | null;

export declare interface SQLitePrepareOptions {
  unscoped?: boolean;

  flags?: number;
}

export declare interface SQLiteAPI {
  bind_collection(
    stmt: number,
    bindings: { [index: string]: SQLiteCompatibleType | null } | Array<SQLiteCompatibleType | null>
  ): number;

  bind(stmt: number, i: number, value: SQLiteCompatibleType | null): number;

  bind_blob(stmt: number, i: number, value: Uint8Array | Array<number>): number;

  bind_double(stmt: number, i: number, value: number): number;

  bind_int(stmt: number, i: number, value: number): number;

  bind_int64(stmt: number, i: number, value: bigint): number;

  bind_null(stmt: number, i: number): number;

  bind_parameter_count(stmt: number): number;

  bind_parameter_name(stmt: number, i: number): string;

  bind_text(stmt: number, i: number, value: string): number;

  changes(db): number;

  clear_bindings(stmt: number): number;

  close(db): Promise<number>;

  column(stmt: number, i: number): SQLiteCompatibleType;

  column_blob(stmt: number, i: number): Uint8Array;

  column_bytes(stmt: number, i: number): number;

  column_count(stmt: number): number;

  column_double(stmt: number, i: number): number;

  column_int(stmt: number, i: number): number;

  column_int64(stmt: number, i: number): bigint;

  column_name(stmt: number, i: number): string;

  column_names(stmt: number): Array<string>;

  column_text(stmt: number, i: number): string;

  column_type(stmt: number, i: number): number;

  commit_hook(
    db: number,
    callback: (() => number) | null): void;

  create_function(
    db: number,
    zFunctionName: string,
    nArg: number,
    eTextRep: number,
    pApp: number,
    xFunc?: (context: number, values: Uint32Array) => void | Promise<void>,
    xStep?: (context: number, values: Uint32Array) => void | Promise<void>,
    xFinal?: (context: number) => void | Promise<void>): number;

  data_count(stmt: number): number;

  exec(
    db: number,
    zSQL: string,
    callback?: (row: Array<SQLiteCompatibleType | null>, columns: string[]) => void
  ): Promise<number>;

  finalize(stmt: number): Promise<number>;

  get_autocommit(db: number): number;

  libversion(): string;

  libversion_number(): number

  limit(
    db: number,
    id: number,
    newVal: number): number;

  open_v2(
    zFilename: string,
    iFlags?: number,
    zVfs?: string
  ): Promise<number>;

  progress_handler(db: number, nProgressOps: number, handler: (userData: unknown) => number | Promise<number>, userData: unknown);

  reset(stmt: number): Promise<number>;

  result(context: number, value: (SQLiteCompatibleType | number[]) | null): void;

  result_blob(context: number, value: Uint8Array | number[]): void;

  result_double(context: number, value: number): void;

  result_int(context: number, value: number): void;

  result_int64(context: number, value: bigint): void;

  result_null(context: number): void;

  result_text(context: number, value: string): void;

  row(stmt: number): Array<SQLiteCompatibleType | null>;

  set_authorizer(
    db: number,
    authFunction: (userData: unknown, iActionCode: number, param3: string | null, param4: string | null, param5: string | null, param6: string | null) => number | Promise<number>,
    userData: unknown): number;

  sql(stmt: number): string;

  statements(db: number, sql: string, options?: SQLitePrepareOptions): AsyncIterable<number>;

  step(stmt: number): Promise<number>;

  update_hook(
    db: number,
    callback: (updateType: number, dbName: string | null, tblName: string | null, rowid: bigint) => void): void;

  value(pValue: number): SQLiteCompatibleType;

  value_blob(pValue: number): Uint8Array;

  value_bytes(pValue: number): number;

  value_double(pValue: number): number;

  value_int(pValue: number): number;

  value_int64(pValue: number): bigint;

  value_text(pValue: number): string;

  value_type(pValue: number): number;

  vfs_register(vfs: FacadeVFS, makeDefault?: boolean): number;
}

export declare function Factory(Module: EmscriptenModule): SQLiteAPI;

export declare class SQLiteError extends Error {
  code: number;

  constructor(message: string, code: number);
}
