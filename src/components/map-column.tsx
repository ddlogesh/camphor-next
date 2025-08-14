"use client";

import {useEffect, Dispatch, SetStateAction} from "react";
import {FileInfo} from "@/src/types/file-info";
import {ImportConfig} from "@/src/types/import-config";
import {Stage} from "@/src/types/global";

type MapColumnProps = {
  importConfig: ImportConfig;
  importFileInfo: FileInfo;
  setImportFileInfo: Dispatch<SetStateAction<FileInfo | null>>;
  setStage: Dispatch<SetStateAction<Stage>>;
};

const MapColumn = (props: MapColumnProps) => {
  const {importConfig, importFileInfo, setImportFileInfo, setStage} = props;

  useEffect(() => {
    console.log('importFileInfo', importFileInfo);
  }, [importFileInfo])

  const onNext = () => {
    setImportFileInfo((prev) => ({
      ...prev as FileInfo,
    }));
    setStage('validate');
  }

  const onBack = () => setStage('header');

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-lg font-semibold text-[#181d27]">
        Match Columns
      </h2>
      <p className="text-sm text-gray-600">
        Map your headers with the expected columns
      </p>
      <div className="flex flex-row items-center mt-6 disabled:opacity-50">
        <button
          className="px-6 py-2 mr-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  )
};

export default MapColumn;
