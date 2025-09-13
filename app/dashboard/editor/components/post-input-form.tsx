"use client";

import type React from "react";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "./multi-select";
import { CSVImportTable } from "./csv-import-table";

const announcementTypes = [
  { value: "Hackathon Announcement", label: "Hackathon Announcement" },
  { value: "Placement Announcement", label: "Placement Announcement" },
  { value: "Internship Announcement", label: "Internship Announcement" },
  { value: "Event Announcement", label: "Event Announcement" },
  { value: "Others Announcement", label: "Others Announcement" },
];

const branchOptions = [
  { value: "cse", label: "CSE" },
  { value: "it", label: "IT" },
  { value: "ce", label: "CE" },
  { value: "ee", label: "EE" },
  { value: "ece", label: "ECE" },
  { value: "mba", label: "MBA" },
  { value: "me", label: "ME" },
];
interface CSVRow {
  [key: string]: string;
}
export function PostInputForm(props: {
  setCsvData: Dispatch<SetStateAction<CSVRow[]>>;
  setAnnouncementType: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setSelectedBranches: Dispatch<SetStateAction<string[]>>;
  setShowTable: Dispatch<SetStateAction<boolean>>;
  title: string;
  announcementType: string;
  selectedBranches: string[];
  showTable: boolean;
  csvData: CSVRow[];
  fileName: string;
  setFileName: Dispatch<SetStateAction<string>>;
}) {
  const {
    title,
    setTitle,
    announcementType,
    setAnnouncementType,
    selectedBranches,
    setSelectedBranches,
    showTable,
    setShowTable,
    setCsvData,
    csvData,
    fileName,
    setFileName,
  } = props;

  return (
    <div className="space-y-3">
      {/* Title Field */}
      <div className="">
        <Label htmlFor="title" className="text-sm font-medium">
          Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcement Type */}
        <div className="">
          <Label htmlFor="announcement-type" className="text-sm font-medium">
            Announcement Type
          </Label>
          <Select value={announcementType} onValueChange={setAnnouncementType}>
            <SelectTrigger>
              <SelectValue placeholder="Select announcement type" />
            </SelectTrigger>
            <SelectContent>
              {announcementTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Branch Multi-Select */}
        <div className="">
          <Label htmlFor="branches" className="text-sm font-medium">
            Branch
          </Label>
          <MultiSelect
            options={branchOptions}
            selected={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="Select branches"
          />
        </div>
      </div>

      {/* Table Toggle Switch */}
      <div className="flex items-center space-x-3 ">
        <Switch
          id="table-toggle"
          checked={showTable}
          onCheckedChange={setShowTable}
        />
        <Label htmlFor="table-toggle" className="text-sm font-medium">
          Enable CSV Import Table
        </Label>
      </div>

      {/* CSV Import Table - Conditionally Rendered */}
      {showTable && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">CSV Import</Label>
          <CSVImportTable
            setCsvData={setCsvData}
            csvData={csvData}
            fileName={fileName}
            setFileName={setFileName}
          />
        </div>
      )}
    </div>
  );
}
