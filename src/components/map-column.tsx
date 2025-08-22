"use client";

import {Dispatch, SetStateAction, useState, useMemo} from "react";
import {FileInfo} from "@/src/types/file-info";
import {ImportConfig} from "@/src/types/import-config";
import {Stage} from "@/src/types/global";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
import _ from 'lodash';

type MapColumnProps = {
  importConfig: ImportConfig;
  importFileInfo: FileInfo;
  setImportFileInfo: Dispatch<SetStateAction<FileInfo | null>>;
  setStage: Dispatch<SetStateAction<Stage>>;
};

const MapColumn = (props: MapColumnProps) => {
  const {importConfig, importFileInfo, setImportFileInfo, setStage} = props;
  const expectedFields = useMemo(
    () => importConfig.fields.map(field => field.id),
    [importConfig.fields]
  );
  const [selectedFields, setSelectedFields] = useState<Record<string, string>>(
    () => {
      const matchingFields = _.intersectionBy(importFileInfo.actualHeaders!, expectedFields, _.toLower);
      const fieldMap: Record<string, string> = {};
      for (const field of matchingFields) fieldMap[field.toLowerCase()] = field;
      return fieldMap;
    }
  );
  const availableFields = useMemo(
    () => _.difference(importFileInfo.actualHeaders, Object.values(selectedFields)),
    [importFileInfo.actualHeaders, selectedFields]
  );

  const onMappingChange = (expectedField: string, selectedField: string) => {
    setSelectedFields(prev => {
      if (selectedField === '__clear__') {
        const { [expectedField.toLowerCase()]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [expectedField.toLowerCase()]: selectedField };
    });
  }
  const allMapped = () => {
    const values = Object.values(selectedFields);
    return values.length === expectedFields.length && values.length === new Set(values).size;
  }

  const onNext = () => {
    setImportFileInfo((prev) => ({
      ...prev as FileInfo,
      columnMapping: selectedFields,
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
          {expectedFields.map(expectedField => {
            const selectedValue = selectedFields[expectedField.toLowerCase()] || "";
            return (
              <div key={expectedField} className="flex flex-row mb-6">
                <p>{expectedField}</p>
                <p className="px-4">-&gt;</p>
                <Select value={selectedValue.toLowerCase()} onValueChange={(val) => onMappingChange(expectedField, val)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose column"/>
                  </SelectTrigger>
                  <SelectContent>
                    {selectedValue && (
                      <>
                        <SelectItem key="__clear__" value="__clear__">
                          <span className="text-gray-400">Choose column</span>
                        </SelectItem>
                        <SelectItem key={selectedValue} value={selectedValue.toLowerCase()}>{selectedValue}</SelectItem>
                      </>
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
          disabled={!allMapped()}
        >
          Next
        </button>
      </div>
    </div>
  )
};

export default MapColumn;
