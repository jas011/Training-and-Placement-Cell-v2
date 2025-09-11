"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-x/editor";
import { PostInputForm } from "./components/post-input-form";
import { Badge } from "@/components/ui/badge";
import { Calendar, Share2 } from "lucide-react";

import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MorphingDialogBasicTwo from "../Table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LexicalRenderer } from "@/app/utilities/render";

interface CSVRow {
  [key: string]: string;
}

/**
 * Initial document value
 */
const initialValue: SerializedEditorState = {
  root: {
    children: [
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            version: 1,
            detail: 0,
            format: 1, // bold
            mode: "normal",
            style: "",
            text: "",
          },
        ],
      },
    ],
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function EditorPage() {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [title, setTitle] = useState("");
  const [announcementType, setAnnouncementType] = useState<string>("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-6 h-fit m-2 p-1 md:p-5 border rounded-2xl md:m-5">
      {/* Editor */}

      <div className="p-4 border rounded-xl ">
        <main className=" bg-background p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Create New Post
            </h1>
            <PostInputForm
              {...{
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
              }}
            />
          </div>
        </main>

        <Editor
          editorSerializedState={editorState}
          onSerializedChange={(value) => setEditorState(value)}
        />
      </div>

      {/* Preview */}
      <div className="p-4 border rounded-xl ">
        <Post
          {...{ title, announcementType, selectedBranches, showTable, csvData }}
          Elem={<LexicalRenderer state={editorState} />}
        />
      </div>
    </div>
  );
}

function Post({
  Elem,
  title,
  announcementType,
  selectedBranches,
  csvData,
  showTable,
}: {
  Elem: ReactNode;
  title: string;
  announcementType: string;
  selectedBranches: string[];
  showTable: boolean;
  csvData: CSVRow[];
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
          className=" mr-2 fill-[#EEBDE0] stroke-1 text-neutral-800"
        />
        {announcementType}
      </Badge>
    );
  };

  return (
    <ScrollArea className=" h-[87vh] w-full ">
      <div className=" bg-white space-x-3 p-4 ">
        <div className="flex flex-col items-left gap-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2 items-center">
              <BadgeButton />
              <span className="flex text-sm">
                <Calendar height={18} />
                December 15, 2024
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild={true}>
                <Button
                  variant={"outline"}
                  className="w-fit h-fit py-1 px-3 rounded-xl"
                >
                  <Share2 />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <h2 className=" text-3xl font-semibold ">{title.toUpperCase()}</h2>
            <div className="flex justify-between h-fit items-center mt-4 mb-5">
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

              {showTable && csvData.length > 0 && (
                <MorphingDialogBasicTwo data={csvData} fileName="Students" />
              )}
            </div>

            {Elem}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
