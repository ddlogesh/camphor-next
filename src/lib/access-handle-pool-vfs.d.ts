import {FacadeVFS} from "@/src/lib/facade-vfs";
import {EmscriptenModule} from "@/src/types/emscripten-module";

export declare class AccessHandlePoolVFS extends FacadeVFS {
  constructor(name: string, module: EmscriptenModule);

  static create(name: string, module: EmscriptenModule): Promise<AccessHandlePoolVFS>;

  jOpen(zName: string | null, fileId: number, flags: number, pOutFlags: DataView): number;
  jClose(fileId: number): number;
  jRead(fileId: number, pData: Uint8Array, iOffset: number): number;
  jWrite(fileId: number, pData: Uint8Array, iOffset: number): number;
  jTruncate(fileId: number, iSize: number): number;
  jSync(fileId: number, flags: number): number;
  jFileSize(fileId: number, pSize64: DataView): number;
  jSectorSize(fileId: number): number;
  jDeviceCharacteristics(fileId: number): number;
  jAccess(zName: string, flags: number, pResOut: DataView): number;
  jDelete(zName: string, syncDir: number): number;

  close(): Promise<void>;
  isReady(): Promise<boolean>;

  getSize(): number;
  getCapacity(): number;
  addCapacity(n: number): Promise<number>;
  removeCapacity(n: number): Promise<number>;
}
