"use client";
import React, { useEffect, useState } from "react";
import Post from "@/app/components/Post";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { docFromHash } from "@/components/editor/utils/doc-serialization";
import { parseDate } from "@/app/utilities/dataParse";
import { LexicalRenderer } from "@/app/utilities/render";
import { Separator } from "@/components/ui/separator";

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

export default function Page() {
  const params = useParams<{ slug: string[] }>();
  const slug = params?.slug;
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getPost(slug);
  }, []);

  const getPost = async (slug: string[]) => {
    setLoading(true);
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
    setPost(parsed);

    setLoading(false);
  };

  return (
    <>
      {post && (
        <div className=" bg-white space-x-3 m-auto my-18 w-[95%] md:w-[50%] border rounded-2xl relative bg-white">
          <div className=" w-fit px-4 py-6">
            <Link href={"/"}>
              <div className=" mx-6 w-fit p-2 border border-primary rounded-[999px]">
                <MoveLeft />
              </div>
            </Link>
          </div>

          <Separator />

          <div className="p-4 ">
            <Post
              {...{
                title: post.title,
                date: parseDate(post.createdAt),
                announcementType: post.announcementType,
                Data: LexicalRenderer({ state: post.parsedDoc }),
                selectedBranches: post.selectedBranches,
                csvData: post.csvData ? post.csvData : [],
                fileName: post.fileName,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
