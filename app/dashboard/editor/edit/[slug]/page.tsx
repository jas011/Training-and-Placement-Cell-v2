"use client";

import React, { useEffect, useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-x/editor";
import { PostInputForm } from "../../components/post-input-form";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LexicalRenderer } from "@/app/utilities/render";
import {
  docFromHash,
  docToHash,
} from "@/components/editor/utils/doc-serialization";
import Post from "@/app/components/Post";
import { parseDate } from "@/app/utilities/dataParse";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2Icon } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";

interface CSVRow {
  [key: string]: string;
}

type Post = {
  id: string;
  title: string;
  createdAt: string;
  announcementType: string;
  doc: string;
  parsedDoc: any;
  selectedBranches: string[];
  csvData: CSVRow[];
  fileName: string;
};

export default function EditorPage() {
  const params = useParams<{ slug: string[] }>();
  const slug = params?.slug;

  const [editorState, setEditorState] = useState<SerializedEditorState>();
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [title, setTitle] = useState("");
  const [announcementType, setAnnouncementType] = useState<string>("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [id, setId] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;
    getPost(slug);
  }, []);

  const getPost = async (slug: string[]) => {
    setId(slug);
    const res = await fetch(`/api/posts/${slug}`, {
      method: "GET",
      redirect: "follow",
    });
    const data: Post = await res.json();

    console.log(data);

    // parse previews here
    const parsed = {
      ...data,
      parsedDoc: await docFromHash(data.doc),
    };

    setTitle(parsed.title);
    setAnnouncementType(parsed.announcementType);
    setSelectedBranches(parsed.selectedBranches);
    if (parsed.csvData) {
      setCsvData(parsed.csvData);
      setShowTable(true);
      setFileName(parsed.fileName);
    }
    setEditorState(parsed.parsedDoc as any);
  };

const Excerpt = (data: any, range: number) => {
  let count = 0;
  const truncatedData: any[] = [];

  for (const text of data.root.children ?? []) {
    if (count >= range) break;

    const children: any[] = [];

    for (const child of text.children ?? []) {
      const textContent = child?.text ?? ""; // safe fallback
      const textLen = textContent.length;

      if (count + textLen <= range) {
        children.push(child);
        count += textLen;
      } else {
        const remaining = range - count;
        if (remaining > 0) {
          children.push({ ...child, text: textContent.slice(0, remaining) });
          count = range;
        }
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



  // const Excerpt = (data: any, range: number) => {
  //   let count = 0,
  //     i = 0;
  //   const truncatedData = [];

  //   for (const text of data.root.children) {
  //     if (count > range) {
  //       break;
  //     }
  //     i++;
  //     const children = [];

  //     for (const data of text.children) {
  //       if (count + data.text.length < range) {
  //         count += data.text.length;
  //         children.push(data);
  //       } else {
  //         const res = { ...data, text: data.text.slice(0, range - count) };
  //         count = range + 1;
  //         children.push(res);
  //         break;
  //       }
  //     }

  //     truncatedData.push({ ...text, children });
  //   }

  //   return {
  //     root: {
  //       ...data.root,
  //       children: truncatedData,
  //     },
  //   };
  // };

  const handlePost = async (status: string) => {
    setLoading(true);
    const data = {
      id,
      title,
      status,
      announcementType,
      selectedBranches,
      csvData,
      doc: await docToHash(editorState as any),
      preview: await docToHash(Excerpt(editorState, 600) as any),
      authorId: "68c42ad12ac817192a9dff51",
      fileName,
      showTable,
    };
    if (!showTable) {
      data.csvData = [];
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(data);
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => {
        console.log(result);

        if(status=="published")toast({
          variant: "success",
          title: "Post published 🎉",
          description: "Your announcement has been published successfully.",
        });

         else toast({
          variant: "success",
          title: "Post Drafted 🎉",
          description: "Your announcement has been Drafted successfully.",
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Something went wrong ❌",
          description: "We couldn’t complete your request. Please try again.",
        });
      });

    console.log(data);
    setLoading(false);
  };

  return (
    <div className="w-full flex items-center flex-col ">
      <div className="w-[95%] flex  flex-col md:grid md:grid-cols-2 gap-6 h-fit border rounded-2xl  mx-2 p-1 ">
        {/* Editor */}

        <div className="p-4 border rounded-xl h-fit">
          <main className=" bg-background p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-8">
                Edit Post
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

          {editorState && (
            <Editor
              editorSerializedState={editorState}
              onSerializedChange={(value) => setEditorState(value)}
            />
          )}
        </div>

        {/* Preview */}
        <div className="p-4 border rounded-xl flex flex-col h-[74.7vh] ">
          <ScrollArea className=" w-full h-[70vh]">
            {editorState && (
              <Post
                {...{
                  title,
                  announcementType,
                  selectedBranches,
                  showTable,
                  csvData: showTable ? csvData : [],
                  Data: <LexicalRenderer state={editorState} />,
                  fileName,
                  date: parseDate(new Date().toLocaleString()),
                  activeShare: false,
                  id: id as any,
                }}
              />
            )}
          </ScrollArea>
        </div>
      </div>
      <div className="flex gap-2 w-full justify-end mx-12 my-5">
        <Button
          disabled={
            (announcementType.length == 0 && title.length == 0) || loading
          }
          variant={"secondary"}
          onClick={() => handlePost("draft")}
        >
          {loading && <Loader2Icon className="animate-spin" />}
          Save Draft
        </Button>
        <Button
          disabled={
            (announcementType.length == 0 && title.length == 0) || loading
          }
          onClick={() => handlePost("published")}
        >
          {loading && <Loader2Icon className="animate-spin" />}
          Publish Post
        </Button>
      </div>
    </div>
  );
}
