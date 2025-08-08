import React, {useEffect, useState} from "react";
import FilePicker from "@/src/components/file-picker";
import SelectHeader from "@/src/components/select-header";
import {FileInfo} from "@/src/types/file-info";
import appConfig from "@/src/lib/config";
import {ImporterError} from "@/src/lib/exceptions/importer-error";
import {useWasmWorker} from "@/src/contexts/wasm-worker";

type Stage = 'upload' | 'header' | 'map' | 'validate' | 'submit';

type DataImporterProps = {
  importId: string;
};

const DataImporter: React.FC<DataImporterProps> = ({importId}) => {
  if (!importId) throw new ImporterError('Missing Import ID');

  const importConfig = appConfig.imports.find(i => i.id === importId);
  if (!importConfig) throw new ImporterError('Invalid Import ID');

  const [stage, setStage] = useState<Stage>('upload');
  const [importFileInfo, setImportFileInfo] = useState<FileInfo | null>(null);
  const wasm = useWasmWorker();

  useEffect(() => {
    (async () => await wasm?.loadWasm(importConfig) )();
  }, [wasm, importConfig]);

  const nextStep = () => {
    switch (stage) {
      case 'upload':
        // TODO: Redirect to validate stage if headers already present in CSV (or) first worksheet of Excel file
        setStage('header');
        break;
      case 'header':
        setStage('map');
        break;
      case 'map':
        setStage('validate');
        break;
      case 'validate':
        setStage('submit');
        break;
      default:
        setStage('upload');
        break;
    }
  }

  const backStep = () => {
    switch (stage) {
      case 'header':
        setStage('upload');
        break;
      case 'map':
        setStage('header');
        break;
      case 'validate':
        setStage('map');
        break;
    }
  }

  return (
    <div>
      {stage === 'upload' && (
        <FilePicker
          onNext={nextStep}
          importConfig={importConfig}
          importFileInfo={importFileInfo}
          setImportFileInfo={setImportFileInfo}
        />
      )}
      {stage === 'header' && (
        <SelectHeader
          onNext={nextStep}
          onBack={backStep}
          importFileInfo={importFileInfo}
          setImportFileInfo={setImportFileInfo}
        />
      )}
    </div>
  );
};

export default DataImporter;
