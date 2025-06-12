'use client';

import React, {useState} from "react";
import * as XLSX from 'xlsx';

type SelectHeaderProps = {
  onNext: () => void;
  onBack: () => void;
  file: File | undefined;
};

const SelectHeader: React.FC<SelectHeaderProps> = ({ file }) => {
  if (file == undefined) {
    return;
  }

  const [worksheets, setWorksheets] = useState<string[]>([]);
  const ext = file.name.split('.').pop()?.toLowerCase();
  const reader = new FileReader();

  reader.onload = (e) => {
    const result = e.target?.result;
    if (!result) {
      console.error('Failed to read file.');
      return;
    }

    try {
      if (ext === 'json') {
        JSON.parse(result as string);
      } else {
        const workbook = XLSX.read(result, {type: 'binary'});
        console.log(workbook.SheetNames);
        XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      }
    } catch (err) {
      console.error('Invalid file content.');
    }
  };

  if (ext === 'json') {
    reader.readAsText(file);
  } else {
    reader.readAsArrayBuffer(file);
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
          className=" px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          // onClick={handleClick}
          // disabled={!fileInfo}
        >
          Back
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          // onClick={handleClick}
          // disabled={!fileInfo}
        >
          Next
        </button>
      </div>
    </div>
  )
};

export default SelectHeader;
