"use client";

import {useEffect, useMemo, useState} from "react";
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

  const importColumns = importConfig.fields.map((field) => field.id.trim().toLowerCase());
  if (importColumns.length !== new Set(importColumns).size) throw new ImporterError('Duplicate Import Field ID found');

  const requiredColumns = importConfig.fields
    .filter(field => field.required)
    .map(field => field.id.trim().toLowerCase());

  const [stage, setStage] = useState<Stage>('upload');
  const [importFileInfo, setImportFileInfo] = useState<FileInfo | null>(null);
  const wasm = useWasmWorker();

  useEffect(() => {
    if (!wasm) return;

    // TODO: If file not found but worksheet_data table contains delimiter rows,
    // if (!importFileInfo?.file && delimiterRow()) setStage('validate');

    wasm.loadWasm(importConfig);
  }, [wasm, importConfig]);

  const isValidStage = useMemo(() => {
    if (!importFileInfo) return false;
    const {file, worksheetId, headerRowId, actualHeaders = [], columnMapping = {}} = importFileInfo;

    switch (stage) {
      case 'upload':
        return true;
      case 'header':
        return Boolean(file || headerRowId);
      case 'map':
        return actualHeaders.length > 0;
      case 'validate':
        const valid = Boolean(worksheetId && headerRowId && Object.keys(columnMapping).length >= requiredColumns.length);
        if (!valid) return false;

        const actualMap: Record<string, number[]> = {};
        importColumns.forEach((col, idx) => {
          const actual = columnMapping[col];
          if (actual) {
            const actualLower = actual.trim().toLowerCase();
            if (!actualMap[actualLower]) actualMap[actualLower] = [];
            actualMap[actualLower].push(idx);
          }
        });
        importFileInfo.columnPosition = actualHeaders.map(header => actualMap[header.trim().toLowerCase()] ?? []);
        importFileInfo.columnTotal = importColumns.length;
        return true;
    }
    return false;
  }, [importFileInfo, stage, requiredColumns, importColumns]);

  const renderContent = () => {
    if (stage === 'upload' || !isValidStage) {
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
          <h1>Review Contents {JSON.stringify(importFileInfo?.columnMapping)} :: {JSON.stringify(importFileInfo?.columnPosition)}</h1>
        );
      default:
        return (
          <h3>Something went wrong :(</h3>
        );
    }
  }

  return (
    <div>{renderContent()}</div>
  )
}

export default DataImporter;
