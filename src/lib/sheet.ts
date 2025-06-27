import pako from 'pako';

const loadWasm = async (): Promise<void> => {
  if (window.calc?.loaded)
    return;

  console.log('Loading Wasm...');
  const go = new window.Go();
  const wasmResponse = await fetch('/wasm/excel.wasm.gz');
  const wasmBytes = pako.ungzip(await wasmResponse.arrayBuffer());
  const { instance } = await WebAssembly.instantiate(wasmBytes, go.importObject);
  go.run(instance);
  console.log('Wasm is initialized!');
};

const getWorksheetNames = async (file: File): Promise<string[]> => {
  const res = window.calc.goSubtract(10, 3);
  console.log(res);
  return [res.toString()];
}

export {
  loadWasm,
  getWorksheetNames,
};
