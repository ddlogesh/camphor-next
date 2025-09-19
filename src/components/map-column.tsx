"use client";

import {Dispatch, SetStateAction, useState, useMemo, useCallback, memo} from "react";
import {FileInfo} from "@/src/types/file-info";
import {ImportConfig} from "@/src/types/import-config";
import {Stage} from "@/src/types/global";
import appConfig from "@/src/lib/config";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";

type MappingState = {
  selected: Record<string, string>;
  available: Set<string>;
};

type MapColumnProps = {
  importConfig: ImportConfig;
  importFileInfo: FileInfo;
  setImportFileInfo: Dispatch<SetStateAction<FileInfo | null>>;
  setStage: Dispatch<SetStateAction<Stage>>;
};

const MapColumn = (props: MapColumnProps) => {
  const {importConfig, importFileInfo, setImportFileInfo, setStage} = props;

  const expectedSet = useMemo(() =>
    new Set(importConfig.fields.map(field => field.id.trim().toLowerCase())),
    [importConfig.fields]
  );

  const requiredFields = useMemo(() =>
    new Set(importConfig.fields.filter(field => field.required).map(field => field.id.trim().toLowerCase())),
    [importConfig.fields]
  );

  const [mapping, setMapping] = useState<MappingState>(() => {
    const selected: Record<string, string> = {};
    const available = new Set<string>();
    const actualHeaders: string[] = importFileInfo.actualHeaders || [];

    for (const actual of actualHeaders) {
      const actualLower = actual.trim().toLowerCase();
      if (!actualLower) continue;

      if (!expectedSet.has(actualLower))
        available.add(actual);
      else if (!selected[actualLower])
        selected[actualLower] = actual;
    }
    return {selected, available};
  });

  const onMappingChange = useCallback((expectedField: string, selectedField: string) => {
    setMapping(prev => {
      const selected = {...prev.selected};
      const available = new Set(prev.available);
      const actual = selected[expectedField];

      if (selectedField === '__clear__') {
        if (actual) available.add(actual);
        delete selected[expectedField];
      } else {
        if (actual && actual !== selectedField) available.add(actual);
        available.delete(selectedField);
        selected[expectedField] = selectedField;
      }

      return {selected, available};
    });
  }, []);

  const availableFields = useMemo(() => {
    if (!appConfig.allowMultiMapping) return Array.from(mapping.available);

    return importFileInfo.actualHeaders!.filter((header) => header.trim().length > 0);
  }, [mapping.available, importFileInfo.actualHeaders]);

  const allMapped = useMemo(() => {
    for (const field of requiredFields) {
      if (!mapping.selected[field]) return false;
    }
    return true;
  }, [mapping.selected, requiredFields]);

  const onNext = () => {
    if (!allMapped) return;

    setImportFileInfo((prev) => ({
      ...prev as FileInfo,
      columnMapping: mapping.selected,
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
      <div>
        <div className="mt-6">
          <p className="text-base font-semibold mb-6">
            Expected Columns -&gt; Actual Columns
          </p>
          {importConfig.fields.map(field => {
            const fieldKey = field.id.toLowerCase();
            const selectedValue = mapping.selected[fieldKey] || "";
            const hasSelection = Boolean(selectedValue);
            const uniqueSelection = hasSelection && !appConfig.allowMultiMapping;

            return (
              <div key={field.id} className="flex flex-row mb-6">
                <p>{field.label}</p>
                <p className="px-4">-&gt;</p>
                <Select value={selectedValue}
                        onValueChange={(val) => onMappingChange(fieldKey, val)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose column"/>
                  </SelectTrigger>
                  <SelectContent>
                    {hasSelection && (
                      <SelectItem key="__clear__" value="__clear__">
                        <span className="text-gray-400">Choose column</span>
                      </SelectItem>
                    )}
                    {uniqueSelection && (
                      <SelectItem key={selectedValue} value={selectedValue}>{selectedValue}</SelectItem>
                    )}
                    {availableFields.map(availableField => (
                      <SelectItem key={availableField} value={availableField}>{availableField}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
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
          disabled={!allMapped}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default memo(MapColumn);
