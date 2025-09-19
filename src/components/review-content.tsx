"use client";

import {Dispatch, SetStateAction, memo, useEffect} from "react";
import {FileInfo} from "@/src/types/file-info";
import {ImportConfig} from "@/src/types/import-config";
import {Stage} from "@/src/types/global";

type ReviewContentProps = {
  importConfig: ImportConfig;
  importFileInfo: FileInfo;
  setImportFileInfo: Dispatch<SetStateAction<FileInfo | null>>;
  setStage: Dispatch<SetStateAction<Stage>>;
};

const ReviewContent = (props: ReviewContentProps) => {
  const {importConfig, importFileInfo, setImportFileInfo, setStage} = props;

  useEffect(() => {
    console.log(importFileInfo.columnMapping, importFileInfo.columnPosition, importFileInfo.columnTotal);
  });

  const onNext = () => {
    setStage('submit');
  }

  const onBack = () => setStage('map');

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-lg font-semibold text-[#181d27]">
        Review Contents
      </h2>
      <p className="text-sm text-gray-600">
        Edit and modify your changes wherever needed
      </p>
      <div>

      </div>

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
          Finish
        </button>
      </div>
    </div>
  )
}

export default memo(ReviewContent);
