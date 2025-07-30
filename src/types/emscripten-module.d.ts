export declare interface EmscriptenModule {
  cwrap: <R, A extends unknown[]>(
    ident: string,
    returnType: 'number' | 'string' | null,
    argTypes: Array<'number' | 'string' | null>
  ) => (...args: A) => R;

  UTF8ToString: (ptr: number) => string;
  HEAPU8: Uint8Array;

  FS: {
    mkdir: (path: string) => void;
    mount: (
      type: Module.WORKERFS,
      opts: { files: File[] },
      path: string
    ) => void;
    unmount: (path: string) => void;
    readdir: (path: string) => string[];
  };

  WORKERFS: unknown;
}
