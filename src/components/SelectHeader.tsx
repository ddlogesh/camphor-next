'use client';

import React from "react";
import {FileInfo} from "@/src/types/file-info";

type SelectHeaderProps = {
  onNext: () => void;
  onBack: () => void;
  importFileInfo: FileInfo | null;
};

const SelectHeader: React.FC<SelectHeaderProps> = ({ onNext, onBack, importFileInfo }) => {
  if (importFileInfo == null) {
    onBack();
    return;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-lg font-semibold text-[#181d27]">
        Select Header
      </h2>
      <p className="text-sm text-gray-600">
        Choose the header row present in your worksheet
      </p>
      <div className="flex flex-row items-center mt-6 disabled:opacity-50">
        <button
          className="px-6 py-2 mr-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  )
};

export default SelectHeader;
