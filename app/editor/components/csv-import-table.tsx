"use client";

import type React from "react";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Papa from "papaparse";
import MorphingDialogBasicTwo from "@/app/Table/page";
import { Label } from "@/components/ui/label";

interface CSVRow {
  [key: string]: string;
}

export function CSVImportTable({
  setCsvData,
  csvData,
}: {
  setCsvData: Dispatch<SetStateAction<CSVRow[]>>;
  csvData: CSVRow[];
}) {
  const [fileName, setFileName] = useState<string>("");

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.split(".")[0]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        setCsvData(results.data);
      },
    });
  };

  useEffect(() => {
    console.log(csvData);
  }, [csvData]);

  return (
    <div className="flex-1 gap-1 flex flex-col">
      <Input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        className="cursor-pointer"
      />
      {csvData.length > 0 && (
        <>
          <Label htmlFor="Preview">Preview</Label>
          <MorphingDialogBasicTwo data={csvData} fileName={fileName} />
        </>
      )}
    </div>
  );
}
