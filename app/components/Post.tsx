import { Badge } from "@/components/ui/badge";
import { Calendar, Share2 } from "lucide-react";

import React, { ReactNode } from "react";
import { SparklesIcon } from "lucide-react";

import MorphingDialogBasicTwo from "@/app/components/Table";
import { ShareButton } from "./shareBtn";

interface CSVRow {
  [key: string]: string;
}

export default function Post({
  id,
  title,
  date,
  announcementType,
  Data,
  selectedBranches,
  csvData,
  fileName,
  activeShare = true,
}: {
  id: string;
  title: string;
  date: string;
  announcementType: string;
  Data: ReactNode;
  selectedBranches: string[];
  csvData: CSVRow[];
  fileName: string;
  activeShare?: boolean;
}) {
  const BadgeButton = () => {
    return (
      <Badge
        variant="outline"
        className="cursor-pointer rounded-[14px] border border-black/10 bg-white text-base md:left-6"
      >
        <SparklesIcon
          style={{
            height: "calc(var(--spacing) * 6)",
            width: "calc(var(--spacing) * 6)",
          }}
          className=" mr-2 fill-[#0088ff] stroke-1 text-neutral-800"
        />
        <span className="whitespace-break-spaces break-words flex-wrap w-min md:w-auto">
          {announcementType}
        </span>
      </Badge>
    );
  };

  return (
    <div className=" bg-white space-x-3 p-4  ">
      <div className="flex flex-col items-left gap-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 items-center">
            <BadgeButton />
            <span className="text-sm hidden md:flex  text-muted-foreground items-center">
              <Calendar height={18} />
              {date}
            </span>
          </div>

          <ShareButton id={id} title={title} ActiveShare={activeShare} />
        </div>
        <span className="text-sm flex items-center md:hidden mb-3 -mt-1 text-muted-foreground">
          <Calendar height={18} />
          {date}
        </span>
        <div>
          <h2 className=" text-3xl font-semibold ">{title}</h2>

          {selectedBranches.length > 0 && (
            <div className="flex justify-between h-fit items-center mt-3.5 mb-5 flex-wrap md:flex-nowrap gap-2">
              <div className="flex gap-2 ">
                {selectedBranches.map((branch, i) => (
                  <Badge
                    variant={"secondary"}
                    key={i}
                    className="border border-primary"
                  >
                    {branch.toUpperCase()}
                  </Badge>
                ))}
              </div>

              {csvData.length > 0 && (
                <MorphingDialogBasicTwo data={csvData} fileName={fileName} />
              )}
            </div>
          )}
          {Data}
        </div>
      </div>
    </div>
  );
}
