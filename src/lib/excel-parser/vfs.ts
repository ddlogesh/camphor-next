import {EmscriptenModule} from "@/src/types/emscripten-module";
import * as VFS from "@/src/lib/constants/sql-codes";
export * from "@/src/lib/constants/sql-codes";

const DEFAULT_SECTOR_SIZE = 512;

export class Base {
  name: string;
  mxPathname: number = 64;
  _module: EmscriptenModule;

  constructor(name: string, module: EmscriptenModule) {
    this.name = name;
    this._module = module;
  }

  close(): void | Promise<void> {
  }

  isReady(): boolean | Promise<boolean> {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasAsyncMethod(methodName: string): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xOpen(pVfs: number, zName: number, pFile: number, flags: number, pOutFlags: number): number | Promise<number> {
    return VFS.SQLITE_CANTOPEN;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xDelete(pVfs: number, zName: number, syncDir: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xAccess(pVfs: number, zName: number, flags: number, pResOut: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xFullPathname(pVfs: number, zName: number, nOut: number, zOut: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xGetLastError(pVfs: number, nBuf: number, zBuf: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xClose(pFile: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xRead(pFile: number, pData: number, iAmt: number, iOffsetLo: number, iOffsetHi: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xWrite(pFile: number, pData: number, iAmt: number, iOffsetLo: number, iOffsetHi: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xTruncate(pFile: number, sizeLo: number, sizeHi: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xSync(pFile: number, flags: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xFileSize(pFile: number, pSize: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xLock(pFile: number, lockType: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xUnlock(pFile: number, lockType: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xCheckReservedLock(pFile: number, pResOut: number): number | Promise<number> {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xFileControl(pFile: number, op: number, pArg: number): number | Promise<number> {
    return VFS.SQLITE_NOTFOUND;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xSectorSize(pFile: number): number {
    return DEFAULT_SECTOR_SIZE;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  xDeviceCharacteristics(pFile: number): number | Promise<number> {
    return 0;
  }
}

export const FILE_TYPE_MASK = [
  VFS.SQLITE_OPEN_MAIN_DB,
  VFS.SQLITE_OPEN_MAIN_JOURNAL,
  VFS.SQLITE_OPEN_TEMP_DB,
  VFS.SQLITE_OPEN_TEMP_JOURNAL,
  VFS.SQLITE_OPEN_TRANSIENT_DB,
  VFS.SQLITE_OPEN_SUBJOURNAL,
  VFS.SQLITE_OPEN_SUPER_JOURNAL,
  VFS.SQLITE_OPEN_WAL,
].reduce((mask, element) => mask | element);
