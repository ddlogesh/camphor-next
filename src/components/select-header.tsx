"use client";

import {useCallback, useEffect, useState, useRef, Dispatch, SetStateAction} from "react";
import DataTable, {DataTableCallbackOptions} from "@/src/components/data-table";
import {FileInfo, HeaderRow, Worksheet} from "@/src/types/file-info";
import {ImportConfig} from "@/src/types/import-config";
import {Stage} from "@/src/types/global";
import {useWasmWorker} from "@/src/contexts/wasm-worker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

type SelectHeaderProps = {
  importConfig: ImportConfig;
  setImportFileInfo: Dispatch<SetStateAction<FileInfo | null>>;
  setStage: Dispatch<SetStateAction<Stage>>;
};

const SelectHeader = (props: SelectHeaderProps) => {
  const {importConfig, setImportFileInfo, setStage} = props;
  const [worksheets, setWorksheets] = useState<Worksheet[] | null>(null);
  const [worksheetId, setWorksheetId] = useState<number>(1);
  const [headerRow, setHeaderRow] = useState<HeaderRow | null>(null);
  const worksheetIdRef = useRef(worksheetId);
  const wasm = useWasmWorker();

  useEffect(() => {
    (async () => {
      if (!wasm) return;

      const sheets = await wasm.fetchWorksheets(importConfig);
      setWorksheets(sheets);
    } )();
  }, [wasm, importConfig]);

  const onSheetChange = async (sheetId: string) => {
    const id = parseInt(sheetId);
    setWorksheetId(id);
    worksheetIdRef.current = id;
  }

  const loadRows = useCallback((_options: DataTableCallbackOptions<HeaderRow>) => {
    if (!wasm) return Promise.resolve([]);

    return wasm.fetchWorksheetPreviews(importConfig, worksheetIdRef.current);
  }, [wasm, importConfig]);

  const onNext = () => {
    if (!headerRow) {
      alert('Please select a header row');
      return;
    }

    setImportFileInfo((prev) => ({
      ...prev as FileInfo,
      worksheetId: worksheetIdRef.current,
      headerRowId: parseInt(headerRow['C0']),
      headerRow,
    }));
    setStage('map');
  }

  const onBack = () => setStage('upload');

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-lg font-semibold text-[#181d27]">
        Select Header
      </h2>
      <p className="text-sm text-gray-600">
        Choose the header row present in your worksheet
      </p>
      {worksheets &&
        <Select value={worksheetId.toString()} onValueChange={onSheetChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Worksheets"/>
          </SelectTrigger>
          <SelectContent>
            {worksheets.map(sheet => (
              <SelectItem key={sheet.id} value={sheet.id.toString()}>{sheet.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      <div className="mt-6 w-1/2">
        {wasm &&
          <DataTable<HeaderRow>
            height={"60vh"}
            worksheetId={worksheetId}
            callback={loadRows}
            hideHeader={true}
            selectable={true}
            setHeaderRow={setHeaderRow}
          />
        }
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
          disabled={!headerRow}
        >
          Next
        </button>
      </div>
    </div>
  )
};

export default SelectHeader;
