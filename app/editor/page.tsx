"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-x/editor";

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

/**
 * Renderer: JSON → JSX
 */
function LexicalRenderer({ state }: { state: SerializedEditorState }) {
  if (!state?.root) return null;

  return (
    <div className="max-w-none">
      {state.root.children.map((node: any, i: number) => {
        switch (node.type) {
          case "paragraph":
            return (
              <p key={i} className="text-md">
                {node.children?.map((child: any, j: number) =>
                  renderNode(child, j)
                )}
              </p>
            );

          case "list":
            if (node.listType === "number") {
              return (
                <ol key={i} className="list-decimal ml-6 mb-3">
                  {node.children?.map((li: any, j: number) => (
                    <li key={j}>
                      {li.children?.map((c: any, k: number) =>
                        renderNode(c, k)
                      )}
                    </li>
                  ))}
                </ol>
              );
            } else {
              return (
                <ul key={i} className="list-disc ml-6 mb-3">
                  {node.children?.map((li: any, j: number) => (
                    <li key={j}>
                      {li.children?.map((c: any, k: number) =>
                        renderNode(c, k)
                      )}
                    </li>
                  ))}
                </ul>
              );
            }

          case "heading":
            return (
              <h2 key={i} className="mt-4 mb-2 font-bold text-xl">
                {node.children?.map((child: any, j: number) =>
                  renderNode(child, j)
                )}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-muted pl-4 italic text-muted-foreground my-3"
              >
                {node.children?.map((child: any, j: number) =>
                  renderNode(child, j)
                )}
              </blockquote>
            );

          case "table":
            return <div key={i} />; // Placeholder for TableParser

          default:
            return null;
        }
      })}
    </div>
  );
}

/**
 * Render inline nodes (text, link, etc.)
 */
function renderNode(node: any, key: number): React.ReactNode {
  if (!node) return null;

  switch (node.type) {
    case "text": {
      let el: React.ReactNode = (
        <span
          key={key}
          style={{ ...parseStyle(node.style), whiteSpace: "pre-wrap" }}
        >
          {node.text}
        </span>
      );

      // Apply formatting
      if (node.format & 1) el = <strong key={key}>{el}</strong>; // Bold
      if (node.format & 2) el = <em key={key}>{el}</em>; // Italic
      if (node.format & 8) el = <u key={key}>{el}</u>; // Underline
      if (node.format & 4) el = <code key={key}>{el}</code>; // Code

      return el;
    }

    case "link":
      return (
        <a
          key={key}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {node.children?.map((c: any, i: number) => renderNode(c, i))}
        </a>
      );

    default:
      return null;
  }
}

/**
 * Helper: Convert inline style string → React style object
 */
function parseStyle(style: string): React.CSSProperties {
  if (!style) return {};
  return style.split(";").reduce((acc: any, rule) => {
    const [prop, value] = rule.split(":").map((s) => s.trim());
    if (prop && value) {
      const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelProp] = value;
    }
    return acc;
  }, {});
}

import { PostInputForm } from "./components/post-input-form";

interface CSVRow {
  [key: string]: string;
}

export default function EditorPage() {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  const [csvData, setCsvData] = useState<CSVRow[]>([]);

  const [title, setTitle] = useState("");
  const [announcementType, setAnnouncementType] = useState<string>("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    console.log(csvData);
  }, [csvData]);

  useEffect(() => {
    console.log(title);
  }, [title]);

  return (
    <div className="grid grid-cols-2 gap-6 h-fit p-5 border rounded-2xl m-5">
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
import MorphingDialogBasicTwo from "../Table/page";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WrapButtonProps {
  className?: string;
  children: React.ReactNode;
  href?: string;
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
          className=" mr-2  fill-[#EEBDE0] stroke-1 text-neutral-800"
          style={{
            height: "calc(var(--spacing) * 6)",
            width: "calc(var(--spacing) * 6)",
          }}
        />
        {announcementType}
      </Badge>
    );
  };

  return (
    <ScrollArea className=" h-[80vh] w-full ">
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

              {showTable && (
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
