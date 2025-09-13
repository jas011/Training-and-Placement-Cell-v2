import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import React, { ReactNode } from "react";
import { SparklesIcon } from "lucide-react";

import Link from "next/link";
import { Globe } from "lucide-react";
import MorphingDialogBasicTwo from "./Table";
import { ShareButton } from "./shareBtn";

interface WrapButtonProps {
  className?: string;
  children: React.ReactNode;
  href?: string;
  rel?: string;
}
interface CSVRow {
  [key: string]: string;
}

export default function Card({
  title,
  date,
  announcementType,
  Data,
  id,
  selectedBranches,
  csvData,
  fileName,
}: {
  title: string;
  date: string;
  announcementType: string;
  Data: ReactNode;
  id: string;
  selectedBranches: string[];
  csvData: CSVRow[];
  fileName: string;
}) {
  const BadgeButton = () => {
    return (
      <Badge
        variant="outline"
        className="w-fit cursor-pointer rounded-[14px] border border-black/10 bg-white text-base md:left-6"
      >
        <SparklesIcon
          style={{
            height: "calc(var(--spacing) * 6)",
            width: "calc(var(--spacing) * 6)",
          }}
          className=" mr-2 fill-[#0088ffad] stroke-1 text-neutral-800"
        />
        <span className="whitespace-break-spaces break-words flex-wrap w-min md:w-auto">
          {announcementType}
        </span>
      </Badge>
    );
  };

  const WrapButton: React.FC<WrapButtonProps> = ({ children, href, rel }) => {
    return (
      <div className="md:w-fit w-full">
        {href && (
          <Link href={href} rel={rel}>
            <div className="border cursor-pointer border-input bg-[#0088ff] p-1 rounded-full flex items-center justify-center text-white md:w-fit w-full">
              <Globe className="mx-1 animate-spin " height={18} />
              <p className="font-medium tracking-tight mr-3 text-sm">
                {children ? children : "Get Started"}
              </p>
            </div>
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="border border-gray-200/60 bg-white space-x-3 p-4 rounded-xl hover:scale-105 hover:shadow-sm transition delay-50 duration-300 ease-in-out">
      <div className="flex flex-col items-left gap-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 items-center justify-between w-full">
            <BadgeButton />
            <span className="text-sm hidden md:flex  text-muted-foreground items-center">
              <Calendar height={18} />
              {date}
            </span>
          </div>
        </div>
        <span className="text-sm flex items-center md:hidden mb-0 -mt-1 text-muted-foreground">
          <Calendar height={18} />
          {date}
        </span>
        <div>
          <h2 className=" text-2xl font-semibold ">{title}</h2>

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

          <div
            className="max-w-none text-sm text-muted-foreground relative 
            line-clamp-7"
            style={{
              overflow: "hidden",
            }}
          >
            {Data}
            <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="flex justify-between w-full align-end flex-col-reverse md:flex-row mt-3 gap-2 items-end">
          <ShareButton id={id} title={title} isFullPost={true} />

          <WrapButton href={`./post/${id}`} rel={title}>
            Read More
          </WrapButton>
        </div>
      </div>
    </div>
  );
}
