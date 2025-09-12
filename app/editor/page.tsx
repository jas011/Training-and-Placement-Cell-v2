"use client";
import { nanoid } from "nanoid";

import React, { useState } from "react";
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
import MorphingDialogBasicTwo from "../components/Table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LexicalRenderer } from "@/app/utilities/render";
import { docToHash } from "@/components/editor/utils/doc-serialization";
import { SerializedDocument } from "@lexical/file";
import Post from "@/app/components/Post";
import { parseDate } from "../utilities/dataParse";

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
  const [fileName, setFileName] = useState<string>("");

  const Excerpt = (data: any, range: number) => {
    let count = 0,
      i = 0;
    const truncatedData = [];

    for (const text of data.root.children) {
      if (count > range) {
        break;
      }
      i++;
      const children = [];

      for (const data of text.children) {
        if (count + data.text.length < range) {
          count += data.text.length;
          children.push(data);
        } else {
          const res = { ...data, text: data.text.slice(0, range - count) };
          count = range + 1;
          children.push(res);
          break;
        }
      }

      truncatedData.push({ ...text, children });
    }

    return {
      root: {
        ...data.root,
        children: truncatedData,
      },
    };
  };

  const handlePost = async () => {
    // const data = {
    //   title,
    //   announcementType,
    //   selectedBranches,
    //   csvData,
    //   excerpt: await docToHash(Excerpt(editorState, 600) as any),
    //   doc: await docToHash(editorState as any),
    // };

    const data = {
      id: nanoid(7),
      title,
      status: "Active",
      announcementType,
      selectedBranches,
      csvData,
      doc: await docToHash(editorState as any),
      preview: await docToHash(Excerpt(editorState, 600) as any),
      authorId: "68c42ad12ac817192a9dff51",
      fileName,
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(data);
    fetch("https://jaskirat.shop/api/posts", {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    console.log(data);
  };

  return (
    <div className="w-full flex items-center flex-col ">
      <div className="w-[95%] flex  flex-col md:grid md:grid-cols-2 gap-6 h-fit border rounded-2xl  mx-2 p-1 ">
        {/* Editor */}

        <div className="p-4 border rounded-xl h-fit">
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
                  fileName,
                  setFileName,
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
        <div className="p-4 border rounded-xl flex flex-col h-[74.7vh] ">
          <ScrollArea className=" w-full h-[70vh]">
            <Post
              {...{
                title,
                announcementType,
                selectedBranches,
                showTable,
                csvData,
                Data: <LexicalRenderer state={editorState} />,
                fileName,
                date: parseDate(new Date().toLocaleString()),
              }}
            />
          </ScrollArea>
        </div>
      </div>
      <Button
        className="mx-12 my-5 self-end"
        disabled={announcementType.length == 0 && title.length == 0}
        onClick={handlePost}
      >
        Publish Post
      </Button>
    </div>
  );
}
