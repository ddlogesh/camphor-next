"use client";

import {useEffect, useState} from "react";
import FilePicker from "@/src/components/file-picker";
import SelectHeader from "@/src/components/select-header";
import MapColumn from "@/src/components/map-column";
import {FileInfo} from "@/src/types/file-info";
import {Stage} from "@/src/types/global";
import appConfig from "@/src/lib/config";
import {ImporterError} from "@/src/lib/exceptions/importer-error";
import {useWasmWorker} from "@/src/contexts/wasm-worker";

type DataImporterProps = {
  importId: string;
};

const DataImporter = (props: DataImporterProps) => {
  const {importId} = props;
  if (!importId) throw new ImporterError('Missing Import ID');

  const importConfig = appConfig.imports.find(i => i.id === importId);
  if (!importConfig) throw new ImporterError('Invalid Import ID');

  const [stage, setStage] = useState<Stage>('upload');
  const [importFileInfo, setImportFileInfo] = useState<FileInfo | null>(null);
  const wasm = useWasmWorker();

  useEffect(() => {
    if (!wasm) return;

    (async () => await wasm.loadWasm(importConfig) )();
  }, [wasm, importConfig]);

  return (
    <div>
      {stage === 'upload' && (
        <FilePicker
          importConfig={importConfig}
          importFileInfo={importFileInfo}
          setImportFileInfo={setImportFileInfo}
          setStage={setStage}
        />
      )}
      {stage === 'header' && importFileInfo && (
        <SelectHeader
          importConfig={importConfig}
          setImportFileInfo={setImportFileInfo}
          setStage={setStage}
        />
      )}
      {stage === 'map' && importFileInfo && (
        <MapColumn
          importConfig={importConfig}
          importFileInfo={importFileInfo}
          setImportFileInfo={setImportFileInfo}
          setStage={setStage}
        />
      )}
      {stage === 'validate' && importFileInfo && (
        <h1>Review Contents {importFileInfo.worksheetId}</h1>
      )}
    </div>
  );
};

export default DataImporter;
