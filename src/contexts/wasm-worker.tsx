import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import * as Comlink from "comlink";
import {ExcelParserWorker} from "@/src/workers";
import ExcelParser from "@/src/workers/excel-parser";

type WorkerAPI = Comlink.Remote<ExcelParser>

const WorkerContext = createContext<WorkerAPI | null>(null);

export const WasmWorkerProvider = ({ children }: PropsWithChildren) => {
  const [api, setApi] = useState<WorkerAPI | null>(null);

  useEffect(() => {
    const worker = ExcelParserWorker();
    const workerApi = Comlink.wrap<ExcelParser>(worker);

    (async () => {
      await workerApi.loadWasm();
      setApi(() => workerApi);
    } )();

    return () => {
      workerApi.close().then(() => worker.terminate());
    };
  }, []);

  return (
    <WorkerContext.Provider value={api}>
      {children}
    </WorkerContext.Provider>
  );
};

export const useWasmWorker = () => useContext(WorkerContext);
