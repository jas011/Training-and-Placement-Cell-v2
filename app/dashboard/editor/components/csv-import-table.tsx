"use client";

import type React from "react";

import { Dispatch, SetStateAction, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Papa from "papaparse";
import MorphingDialogBasicTwo from "@/app/components/Table";
import { Label } from "@/components/ui/label";

interface CSVRow {
  [key: string]: string;
}

export function CSVImportTable({
  setCsvData,
  csvData,
  fileName,
  setFileName,
}: {
  setCsvData: Dispatch<SetStateAction<CSVRow[]>>;
  csvData: CSVRow[];
  fileName: string;
  setFileName: Dispatch<SetStateAction<string>>;
}) {
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.split(".")[0]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data = results.data.map((item: any) => {
          // delete all possible variants
          delete item["S.No"];
          delete item["sno"];
          delete item["Sno"];

          return item;
        });

        console.log(data);
        setCsvData(data);
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
