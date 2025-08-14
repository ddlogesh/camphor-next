import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import * as Comlink from "comlink";
import {ExcelParserWorker} from "@/src/workers";
import ExcelParser from "@/src/workers/excel-parser";

const WorkerContext = createContext<Comlink.Remote<ExcelParser> | null>(null);

export const WasmWorkerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [api, setApi] = useState<Comlink.Remote<ExcelParser> | null>(null);

  useEffect(() => {
    const worker = ExcelParserWorker();
    const workerApi = Comlink.wrap<ExcelParser>(worker);

    (async () => {
      await workerApi.loadWasm();
      setApi(() => workerApi);
    } )();

    return () => {
      workerApi.close().then(() => {
        worker.terminate();
        console.log('Worker terminated');
      });
    };
  }, []);

  return (
    <WorkerContext.Provider value={api}>
      {children}
    </WorkerContext.Provider>
  );
};

export const useWasmWorker = () => useContext(WorkerContext);
