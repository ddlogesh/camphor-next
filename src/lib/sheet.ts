const loadWasm = async (): Promise<void> => {
  if (window.calc?.loaded)
    return;

  const go = new window.Go();
  const wasmPromise = fetch('/wasm/excel.wasm.gz');
  console.log('Loading Wasm...');
  const { instance } = await WebAssembly.instantiateStreaming(wasmPromise, go.importObject);
  go.run(instance);
  console.log('Wasm is initialized!');
};

const getWorksheetNames = async (file: File): Promise<string[]> => {
  if (!window.calc?.loaded)
    await loadWasm();

  const res = window.calc.goSubtract(10, 3);
  return [res.toString()];
}

export {
  loadWasm,
  getWorksheetNames,
};
