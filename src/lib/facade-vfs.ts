import {EmscriptenModule} from "@/src/types/emscripten-module";
import * as VFS from './vfs';

const AsyncFunction = Object.getPrototypeOf(async function () {
}).constructor;

export class FacadeVFS extends VFS.Base {
  constructor(name: string, module: EmscriptenModule) {
    super(name, module);
  }

  hasAsyncMethod(methodName: string): boolean {
    const jMethodName = `j${methodName.slice(1)}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this as any)[jMethodName] instanceof AsyncFunction;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFilename(pFile: number): never {
    throw new Error('unimplemented');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jOpen(filename: string | null, pFile: number, flags: number, pOutFlags: DataView): number {
    return VFS.SQLITE_CANTOPEN;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jDelete(filename: string, syncDir: number): number {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jAccess(filename: string, flags: number, pResOut: DataView): number {
    return VFS.SQLITE_OK;
  }

  jFullPathname(filename: string, zOut: Uint8Array): number {
    const {read, written} = new TextEncoder().encodeInto(filename, zOut);
    if (read < filename.length) return VFS.SQLITE_IOERR;
    if (written >= zOut.length) return VFS.SQLITE_IOERR;
    zOut[written] = 0;
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jGetLastError(zBuf: Uint8Array): number {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jClose(pFile: number): number {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jRead(pFile: number, pData: Uint8Array, iOffset: number): number {
    pData.fill(0);
    return VFS.SQLITE_IOERR_SHORT_READ;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jWrite(pFile: number, pData: Uint8Array, iOffset: number): number {
    return VFS.SQLITE_IOERR_WRITE;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jTruncate(pFile: number, size: number): number {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jSync(pFile: number, flags: number): number {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jFileSize(pFile: number, pSize: DataView): number {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jLock(pFile: number, lockType: number): number {
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jUnlock(pFile: number, lockType: number): number {
    return VFS.SQLITE_OK;
  }

  jCheckReservedLock(pFile: number, pResOut: DataView): number {
    pResOut.setInt32(0, 0, true);
    return VFS.SQLITE_OK;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jFileControl(pFile: number, op: number, pArg: DataView): number {
    return VFS.SQLITE_NOTFOUND;
  }

  jSectorSize(pFile: number): number {
    return super.xSectorSize(pFile);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jDeviceCharacteristics(pFile: number): number {
    return 0;
  }

  xOpen(pVfs: number, zName: number, pFile: number, flags: number, pOutFlags: number): number {
    const filename = this.#decodeFilename(zName, flags);
    const pOutFlagsView = this.#makeTypedDataView('Int32', pOutFlags);
    return this.jOpen(filename, pFile, flags, pOutFlagsView);
  }

  xDelete(pVfs: number, zName: number, syncDir: number): number {
    const filename = this._module.UTF8ToString(zName);
    return this.jDelete(filename, syncDir);
  }

  xAccess(pVfs: number, zName: number, flags: number, pResOut: number): number {
    const filename = this._module.UTF8ToString(zName);
    const pResOutView = this.#makeTypedDataView('Int32', pResOut);
    return this.jAccess(filename, flags, pResOutView);
  }

  xFullPathname(pVfs: number, zName: number, nOut: number, zOut: number): number {
    const filename = this._module.UTF8ToString(zName);
    const zOutArray = this._module.HEAPU8.subarray(zOut, zOut + nOut);
    return this.jFullPathname(filename, zOutArray);
  }

  xGetLastError(pVfs: number, nBuf: number, zBuf: number): number {
    const zBufArray = this._module.HEAPU8.subarray(zBuf, zBuf + nBuf);
    return this.jGetLastError(zBufArray);
  }

  xClose(pFile: number): number {
    return this.jClose(pFile);
  }

  xRead(pFile: number, pData: number, iAmt: number, iOffsetLo: number, iOffsetHi: number): number {
    const pDataArray = this.#makeDataArray(pData, iAmt);
    const iOffset = delegalize(iOffsetLo, iOffsetHi);
    return this.jRead(pFile, pDataArray, iOffset);
  }

  xWrite(pFile: number, pData: number, iAmt: number, iOffsetLo: number, iOffsetHi: number): number {
    const pDataArray = this.#makeDataArray(pData, iAmt);
    const iOffset = delegalize(iOffsetLo, iOffsetHi);
    return this.jWrite(pFile, pDataArray, iOffset);
  }

  xTruncate(pFile: number, sizeLo: number, sizeHi: number): number {
    const size = delegalize(sizeLo, sizeHi);
    return this.jTruncate(pFile, size);
  }

  xSync(pFile: number, flags: number): number {
    return this.jSync(pFile, flags);
  }

  xFileSize(pFile: number, pSize: number): number {
    const pSizeView = this.#makeTypedDataView('BigInt64', pSize);
    return this.jFileSize(pFile, pSizeView);
  }

  xLock(pFile: number, lockType: number): number {
    return this.jLock(pFile, lockType);
  }

  xUnlock(pFile: number, lockType: number): number {
    return this.jUnlock(pFile, lockType);
  }

  xCheckReservedLock(pFile: number, pResOut: number): number {
    const pResOutView = this.#makeTypedDataView('Int32', pResOut);
    return this.jCheckReservedLock(pFile, pResOutView);
  }

  xFileControl(pFile: number, op: number, pArg: number): number {
    const pArgView = new DataView(
      this._module.HEAPU8.buffer,
      this._module.HEAPU8.byteOffset + pArg
    );
    return this.jFileControl(pFile, op, pArgView);
  }

  xSectorSize(pFile: number): number {
    return this.jSectorSize(pFile);
  }

  xDeviceCharacteristics(pFile: number): number {
    return this.jDeviceCharacteristics(pFile);
  }

  #makeTypedDataView(type: 'Int32' | 'BigInt64', byteOffset: number): DataView {
    const byteLength = type === 'Int32' ? 4 : 8;
    const getter = `get${type}`;
    const setter = `set${type}`;
    const makeDataView = () =>
      new DataView(
        this._module.HEAPU8.buffer,
        this._module.HEAPU8.byteOffset + byteOffset,
        byteLength
      );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dataView: DataView<ArrayBufferLike> | any = makeDataView();
    return new Proxy(dataView, {
      get(_, prop) {
        if (dataView.buffer.byteLength === 0) {
          dataView = makeDataView();
        }
        if (prop === getter) {
          return function (byteOffset: number, littleEndian?: boolean) {
            if (!littleEndian) throw new Error('must be little endian');
            return dataView[prop](byteOffset, littleEndian);
          };
        }
        if (prop === setter) {
          return function (
            byteOffset: number,
            value: number | bigint,
            littleEndian?: boolean
          ) {
            if (!littleEndian) throw new Error('must be little endian');
            return dataView[prop](byteOffset, value, littleEndian);
          };
        }
        if (typeof prop === 'string' && prop.match(/^(get)|(set)/)) {
          throw new Error('invalid type');
        }
        const result = dataView[prop];
        return typeof result === 'function' ? result.bind(dataView) : result;
      },
    });
  }

  #makeDataArray(byteOffset: number, byteLength: number): Uint8Array {
    let target = this._module.HEAPU8.subarray(
      byteOffset,
      byteOffset + byteLength
    );
    return new Proxy(target, {
      get: (_, prop: string | symbol) => {
        if (target.buffer.byteLength === 0) {
          target = this._module.HEAPU8.subarray(
            byteOffset,
            byteOffset + byteLength
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (target as any)[prop];
        return typeof result === 'function' ? result.bind(target) : result;
      },
    });
  }

  #decodeFilename(zName: number, flags: number): string | null {
    if (flags & VFS.SQLITE_OPEN_URI) {
      let pName = zName;
      let state: number | null = 1;
      const charCodes: number[] = [];
      while (state) {
        const charCode = this._module.HEAPU8[pName++];
        if (charCode) {
          charCodes.push(charCode);
        } else {
          if (!this._module.HEAPU8[pName]) state = null;
          switch (state) {
            case 1:
              charCodes.push('?'.charCodeAt(0));
              state = 2;
              break;
            case 2:
              charCodes.push('='.charCodeAt(0));
              state = 3;
              break;
            case 3:
              charCodes.push('&'.charCodeAt(0));
              state = 2;
              break;
          }
        }
      }
      return new TextDecoder().decode(new Uint8Array(charCodes));
    }
    return zName ? this._module.UTF8ToString(zName) : null;
  }
}

function delegalize(lo32: number, hi32: number): number {
  return hi32 * 0x100000000 + lo32 + (lo32 < 0 ? 2 ** 32 : 0);
}
