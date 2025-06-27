'use client';

import {useEffect, useState} from "react";
import RootLayout from "@/src/app/Layout";
import UploadFile from "@/src/components/UploadFile";
import SelectHeader from "@/src/components/SelectHeader";
import {loadWasm} from "@/src/lib/sheet";
import {FileInfo} from "@/src/types/file-info";

type Stage = 'upload' | 'header' | 'map' | 'validate' | 'submit';

export default function UploadFilePage() {
  const [stage, setStage] = useState<Stage>('upload');
  const [importFileInfo, setImportFileInfo] = useState<FileInfo | null>(null);

  useEffect(() => {
    loadWasm();
  }, []);

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
    <RootLayout>
      {stage === 'upload' && (
        <UploadFile
          onNext={nextStep}
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
    </RootLayout>
  );
}
