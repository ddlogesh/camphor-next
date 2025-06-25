'use client';

import React, {useCallback, useState} from 'react';
import {ErrorCode, FileRejection, useDropzone} from 'react-dropzone';
import {
  DownloadIcon,
  ChevronDownIcon,
} from "lucide-react"

import {Button} from "@/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {partial} from 'filesize';
import {saveAs} from 'file-saver';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import appConfig from "@/src/app/config";
import {parseJSON, toPlural} from "@/src/lib/utils";
import {fetchSampleData} from "@/src/lib/fakedata";
import {ImportConfig} from "@/src/types/import-config";
import {FileInfo} from "@/src/types/file-info";
import {getWorksheetNames} from "@/src/lib/sheet";

const SUPPORTED_MIME_TYPES: { [key: string]: string } = {
  'csv': 'text/csv',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'json': 'application/json',
};

const FileExtensions: string[] = appConfig.fileExtensions ||
  (process.env.NEXT_PUBLIC_FILE_EXTENSIONS && parseJSON(process.env.NEXT_PUBLIC_FILE_EXTENSIONS)) ||
  Object.keys(SUPPORTED_MIME_TYPES);
const fileExtensionText: string = FileExtensions.map((ext) => `.${ext}`).join(', ');
const MaxFileSizeMB: number = appConfig.maxFileSizeMB ||
  (process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB && parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB)) ||
  50;
const fileSize = partial({standard: 'jedec'});
const ErrorMessages: { [key: string]: string } = {
  [ErrorCode.FileInvalidType]: `Please upload a valid file. Supported file ${toPlural('format', FileExtensions.length)}: ${fileExtensionText}`,
  [ErrorCode.FileTooLarge]: `File size is too large. Max file size is ${MaxFileSizeMB} MB`,
  [ErrorCode.TooManyFiles]: `Please upload a single file at once`,
};

type UploadFileProps = {
  onNext: () => void;
  importFileInfo: FileInfo | null;
  setImportFileInfo: (fileInfo: FileInfo | null) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({onNext, importFileInfo, setImportFileInfo}) => {
  const [error, setError] = useState<string>('');

  const removeFile = () => {
    setError('');
    setImportFileInfo(null);
  }

  /* Export file as CSV, Excel or JSON */

  const exportFile = (fileFormat: string) => {
    const importConfig: ImportConfig = appConfig.imports[0];
    const data = fetchSampleData(importConfig, {serializeObject: true});
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, importConfig.label);

    const bookType: XLSX.BookType = fileFormat as XLSX.BookType;
    const fileName = `${importConfig.id}-sample.${fileFormat}`;
    XLSX.writeFile(workbook, fileName, {bookType, type: 'file'});
  }

  const exportCSV = () => {
    exportFile('csv');
  }

  const exportXLSX = () => {
    exportFile('xlsx');
  }

  const exportJSON = () => {
    const importConfig: ImportConfig = appConfig.imports[0];
    const data = fetchSampleData(importConfig);
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], {type: 'application/json;charset=utf-8;'});
    saveAs(blob, `${importConfig.id}-sample.json`);
  }

  /* Accept file via react-dropzone */

  const acceptFileFormats = () => {
    let result: { [key: string]: string[] } = {};
    FileExtensions.forEach((extension) => {
      result[SUPPORTED_MIME_TYPES[extension]] = [`.${extension}`]
    });
    return result;
  };

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError('');
    setImportFileInfo(null);

    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      setError(_.get(ErrorMessages, error.code, error.message));
      return;
    }

    const file = acceptedFiles[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const fileInfo: FileInfo = {
      name: file.name,
      size: fileSize(file.size),
      extension: ext || 'binary',
      file,
    }
    if (ext === 'xlsx') {
      const worksheets = await getWorksheetNames(file);
      fileInfo.worksheets = worksheets;
      fileInfo.worksheet = worksheets[0];
    }
    // TODO: Auto-select the header row if it's a first row.
    setImportFileInfo(fileInfo);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    maxSize: MaxFileSizeMB * 1024 * 1024,
    accept: acceptFileFormats(),
  });

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-lg font-semibold text-[#181d27]">
        Upload File
      </h2>
      <p className="text-sm text-gray-600">
        Add your documents here
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-4">
            <DownloadIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
            Sample File
            <ChevronDownIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {FileExtensions.includes('json') &&
              <DropdownMenuItem onClick={exportJSON}>
                  JSON File
              </DropdownMenuItem>
          }
          {FileExtensions.includes('csv') &&
              <DropdownMenuItem onClick={exportCSV}>
                  CSV File
              </DropdownMenuItem>
          }
          {FileExtensions.includes('xlsx') &&
              <DropdownMenuItem onClick={exportXLSX}>
                  Excel File
              </DropdownMenuItem>
          }
        </DropdownMenuContent>
      </DropdownMenu>
      <div
        {...getRootProps()}
        className={`w-full max-w-2xl h-64 mt-4 border-4 border-dashed rounded-lg flex items-center justify-center cursor-pointer 
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
        `}
      >
        <input {...getInputProps()} />
        {
          isDragActive
            ? <p className="text-blue-700 text-lg">Drop the file here...</p>
            : <div className="flex flex-col items-center">
              <p className="text-gray-500 text-sm">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-sm">Max {MaxFileSizeMB} MB file is allowed</p>
            </div>
        }
      </div>
      <p className="mt-2 text-gray-500 text-sm">Only supports {fileExtensionText} {toPlural('file', FileExtensions.length)}</p>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {importFileInfo && (
        <div className="mt-6 p-4 bg-white rounded shadow w-full max-w-md relative">
          <p className="text-gray-600">{importFileInfo.name} ({importFileInfo.size})</p>
          <span className="absolute top-0 bottom-0 right-0 px-3 py-4">
            <svg className="fill-current h-6 w-6 text-red-500 cursor-pointer" role="button" viewBox="0 0 20 20"
                 onClick={removeFile}>
              <title>Close</title>
              <path
                d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={onNext}
        disabled={!importFileInfo}
      >
        Next
      </button>
    </div>
  );
};

export default UploadFile;
