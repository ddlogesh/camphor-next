'use client';

import React, {useCallback, useState} from 'react';
import {useRouter} from 'next/router';
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
import _ from 'lodash';
import * as XLSX from 'xlsx';
import appConfig from "@/src/app/config";
import {parseJSON, toPlural} from "@/src/lib/utils";
import {fetchSampleData} from "@/src/lib/fakedata";

type FileInfo = {
  name: string;
  size: string;
  extension: string;
};

type UploadFileProps = {
  onNext: () => void;
}

const SUPPORTED_MIME_TYPES: { [key: string]: string } = {
  'csv': 'text/csv',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'xls': 'application/vnd.ms-excel',
  'json': 'application/json',
};

const FILE_EXTENSIONS: string[] = appConfig.FILE_EXTENSIONS ||
  (process.env.NEXT_PUBLIC_FILE_EXTENSIONS && parseJSON(process.env.NEXT_PUBLIC_FILE_EXTENSIONS)) ||
  Object.keys(SUPPORTED_MIME_TYPES);
const fileExtensionText: string = FILE_EXTENSIONS.map((ext) => `.${ext}`).join(', ');
const MAX_FILE_SIZE_MB: number = appConfig.MAX_FILE_SIZE_MB ||
  (process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB && parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB)) ||
  50;
const fileSize = partial({standard: 'jedec'});
const ErrorMessages: { [key: string]: string } = {
  [ErrorCode.FileInvalidType]: `Please upload a valid file. Supported file ${toPlural('format', FILE_EXTENSIONS.length)}: ${fileExtensionText}`,
  [ErrorCode.FileTooLarge]: `File size is too large. Max file size is ${MAX_FILE_SIZE_MB} MB`,
  [ErrorCode.TooManyFiles]: `Please upload a single file at once`,
};

const UploadFile: React.FC<UploadFileProps> = ({onNext}) => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();
  const handleClick = () => {
    router.push('/select-header');
  }
  const removeFile = () => {
    setError('');
    setFileInfo(null);
  }

  const downloadCsv = () => {
    const importConfig = appConfig.imports[0];
    const sampleData = fetchSampleData(importConfig);
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, importConfig.label);
    XLSX.writeFile(workbook, `${importConfig.id}-sample.csv`, { bookType: 'csv' });
    // TODO: object and array data is missing in CSV file
  }

  const downloadExcel = () => {

  }

  const acceptFileFormats = () => {
    let result: { [key: string]: string[] } = {};
    FILE_EXTENSIONS.forEach((extension) => {
      result[SUPPORTED_MIME_TYPES[extension]] = [`.${extension}`]
    });
    return result;
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError('');
    setFileInfo(null);

    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      setError(_.get(ErrorMessages, error.code, error.message));
      return;
    }

    const file = acceptedFiles[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    setFileInfo({
      name: file.name,
      size: fileSize(file.size),
      extension: ext || 'binary',
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
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
          <DropdownMenuItem onClick={downloadCsv}>
            CSV File
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadExcel}>
            Excel File
          </DropdownMenuItem>
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
              <p className="text-gray-500 text-sm">Max {MAX_FILE_SIZE_MB} MB file is allowed</p>
            </div>
        }
      </div>
      <p className="mt-2 text-gray-500 text-sm">Only supports {fileExtensionText} {toPlural('file', FILE_EXTENSIONS.length)}</p>

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {fileInfo && (
        <div className="mt-6 p-4 bg-white rounded shadow w-full max-w-md relative">
          <p className="text-gray-600">{fileInfo.name} ({fileInfo.size})</p>
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
        onClick={handleClick}
        disabled={!fileInfo}
      >
        Next
      </button>
    </div>
  );
};

export default UploadFile;
