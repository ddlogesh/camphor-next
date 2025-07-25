'use client';

import {useState} from "react";
import RootLayout from "@/src/app/Layout";
import UploadFile from "@/src/components/UploadFile";
import SelectHeader from "@/src/components/SelectHeader";
import {FileInfo} from "@/src/types/file-info";

type Stage = 'upload' | 'header' | 'map' | 'validate' | 'submit';

export default function UploadFilePage() {
  const [stage, setStage] = useState<Stage>('upload');
  const [importFileInfo, setImportFileInfo] = useState<FileInfo | null>(null);

  const nextStep = () => {
    switch (stage) {
      case 'upload':
        setStage('header');
        break;
      case 'header':
        setStage('map');
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
        />
      )}
    </RootLayout>
  );
}
