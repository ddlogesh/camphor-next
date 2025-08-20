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

  const importColumns = importConfig.fields.map((field) => field.id);
  if (importColumns.length !== new Set(importColumns).size) throw new ImporterError('Duplicate Import Field ID found');

  const [stage, setStage] = useState<Stage>('upload');
  const [importFileInfo, setImportFileInfo] = useState<FileInfo | null>(null);
  const wasm = useWasmWorker();

  useEffect(() => {
    if (!wasm) return;

    (async () => await wasm.loadWasm(importConfig))();
  }, [wasm, importConfig]);

  const isValidStage = () => {
    const {file, worksheetId, headerRowId, actualHeaders = [], columnMapping = {}} = importFileInfo || {};

    switch (stage) {
      case 'upload':
        return true;
      case 'header':
        return file || headerRowId;
      case 'map':
        return actualHeaders.length >= importColumns.length;
      case 'validate':
        return worksheetId && headerRowId && Object.keys(columnMapping).length == importColumns.length;
    }
    return false;
  }

  const render = () => {
    if (stage === 'upload' || !isValidStage()) {
      return (
        <FilePicker
          importConfig={importConfig}
          importFileInfo={importFileInfo}
          setImportFileInfo={setImportFileInfo}
          setStage={setStage}
        />
      );
    }

    switch (stage) {
      case 'header':
        return (
          <SelectHeader
            importConfig={importConfig}
            importFileInfo={importFileInfo as FileInfo}
            setImportFileInfo={setImportFileInfo}
            setStage={setStage}
          />
        );
      case 'map':
        return (
          <MapColumn
            importConfig={importConfig}
            importFileInfo={importFileInfo as FileInfo}
            setImportFileInfo={setImportFileInfo}
            setStage={setStage}
          />
        );
      case 'validate':
        return (
          <h1>Review Contents {importFileInfo?.worksheetId}</h1>
        );
    }
  }

  return (
    <div>{render()}</div>
  )
}

export default DataImporter;
