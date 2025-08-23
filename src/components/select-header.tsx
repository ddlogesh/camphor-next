"use client";

import {useCallback, useEffect, useState, useRef, useMemo, Dispatch, SetStateAction, memo} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select"
import DataTable, {DataTableCallbackOptions} from "@/src/components/data-table";
import {FileInfo, Worksheet, HeaderRow} from "@/src/types/file-info";
import {ImportConfig} from "@/src/types/import-config";
import {Stage} from "@/src/types/global";
import {ColumnDefinition} from "tabulator-tables";
import {useWasmWorker} from "@/src/contexts/wasm-worker";
import {nextStage} from "@/src/lib/utils";
import {ImporterError} from "@/src/lib/exceptions/importer-error";

type SelectHeaderProps = {
  importConfig: ImportConfig;
  importFileInfo: FileInfo;
  setImportFileInfo: Dispatch<SetStateAction<FileInfo | null>>;
  setStage: Dispatch<SetStateAction<Stage>>;
};

const SelectHeader = (props: SelectHeaderProps) => {
  const {importConfig, importFileInfo, setImportFileInfo, setStage} = props;
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [worksheetId, setWorksheetId] = useState<number>(importFileInfo.worksheetId ?? 1);
  const [selectedRow, setSelectedRow] = useState<HeaderRow | null>(null);
  const [error, setError] = useState<string>('');
  const worksheetIdRef = useRef(worksheetId);
  const wasm = useWasmWorker();

  const metadata = useMemo(() => ({worksheetId}), [worksheetId]);
  const columns: ColumnDefinition[] = useMemo(() => [
    {field: 'worksheetId', title: 'Worksheet Id', visible: false},
    {field: 'rowId', title: 'Row Id', visible: false},
    {field: 'C0', title: 'C0', formatter: 'rowSelection', resizable: false, frozen: true, hozAlign: 'center'},
  ], []);
  const selectRow = useMemo(() => {
    const {worksheetId, headerRowId} = importFileInfo;
    if (!worksheetId || !headerRowId) return;

    return `${worksheetId}:${headerRowId}`;
  }, [importFileInfo]);

  const onSheetChange = async (sheetId: string) => {
    const id = parseInt(sheetId);
    setWorksheetId(id);
    worksheetIdRef.current = id;
    setError('');
  }

  useEffect(() => {
    (async () => {
      if (!wasm) return;

      const sheets = await wasm.fetchWorksheets(importConfig);
      setWorksheets(sheets);
    })();
  }, [wasm, importConfig]);

  useEffect(() => setError(''), [selectedRow]);

  const loadRows = useCallback((options: DataTableCallbackOptions<HeaderRow>) => {
    if (!wasm) return Promise.resolve([]);

    return wasm.fetchWorksheetPreviews(importConfig, worksheetIdRef.current, options);
  }, [wasm, importConfig]);

  const onNext = () => {
    try {
      if (!selectedRow) throw new ImporterError('Please select a header row');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {worksheetId, rowId: headerRowId, C0, ...fields} = selectedRow;
      const actualHeaders = Object.values(fields);

      const stage = nextStage(importConfig.fields, actualHeaders);
      setImportFileInfo((prev) => ({
        ...prev as FileInfo,
        worksheetId,
        headerRowId,
        actualHeaders,
      }));
      setStage(stage);
    } catch (err) {
      if (err instanceof ImporterError) setError(err.message);
    }
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
      {worksheets.length > 1 &&
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
            columns={columns}
            callback={loadRows}
            hideHeader={true}
            selectable={true}
            selectRow={selectRow}
            setSelectedRow={setSelectedRow}
            rowIndex={'C0'}
            metadata={metadata}
          />
        }
      </div>

      {error && <p className="mt-6 text-red-600">{error}</p>}

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
          disabled={!selectedRow || !!error}
        >
          Next
        </button>
      </div>
    </div>
  )
};

export default memo(SelectHeader);
