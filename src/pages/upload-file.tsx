'use client';

import {useState} from "react";
import RootLayout from "@/src/app/Layout";
import UploadFile from "@/src/components/UploadFile";
import SelectHeader from "@/src/components/SelectHeader";

type Stage = 'upload' | 'header' | 'map' | 'validate' | 'submit';

export default function UploadFilePage() {
  const [stage, setStage] = useState<Stage>('upload');
  return (
    <RootLayout>
      {stage === 'upload' && (
        <UploadFile onNext={() => setStage('header')}/>
      )}
      {stage === 'header' && (
        <SelectHeader
          onNext={() => setStage('map')}
          onBack={() => setStage('upload')}
          file={undefined}
        />
      )}
    </RootLayout>
  );
}
