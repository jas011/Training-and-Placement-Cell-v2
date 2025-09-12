"use client";

import { useState, useEffect } from "react";
import { useIntersectionObserver } from "react-haiku";
import Card from "./components/card";
import { parseDate } from "@/app/utilities/dataParse";
import { docFromHash } from "@/components/editor/utils/doc-serialization";
import { LexicalRendererPreview } from "@/app/utilities/render";
import SkeletonCard from "./components/Skeleton";

interface CSVRow {
  [key: string]: string;
}

type Post = {
  id: string;
  title: string;
  createdAt: string;
  announcementType: string;
  preview: string;
  parsedPreview: any;
  selectedBranches: string[];
  csvData: CSVRow[];
  fileName: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Map<string, Post>>(new Map());
  const [cursor, setCursor] = useState<string | null>(null); //last Post id
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { observeRef, isVisible } = useIntersectionObserver({
    animateOnce: false,
    options: {
      threshold: 0.5,
      rootMargin: "-50% 0px 0% 0px",
    },
  });

  useEffect(() => {
    if (isVisible && hasMore) loadMore();
  }, [isVisible]);

  const loadMore = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/posts?limit=10${cursor ? `&cursor=${cursor}` : ""}`
    );
    const data: Post[] = await res.json();

    if (data.length > 0) {
      // parse previews here
      const parsed = await Promise.all(
        data.map(async (p) => ({
          ...p,
          parsedPreview: await docFromHash(p.preview),
        }))
      );

      setPosts((prev) => {
        const next = new Map(prev);
        for (const p of parsed) {
          next.set(p.id, p); // overwrite if duplicate
        }
        return next;
      });
      setCursor(data[data.length - 1].id);
    } else setHasMore(false);

    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="flex justify-center  w-full">
      <div className="w-full md:w-[60%] flex flex-col gap-5 justify-center">
        {Array.from(posts.values()).map((post, i) => {
          const isLast = i === Array.from(posts.keys()).length - 1;
          return (
            <div
              key={post.id}
              ref={isLast ? (observeRef as any) : null}
              className="m-5"
            >
              <Card
                {...{
                  id: post.id,
                  title: post.title,
                  date: parseDate(post.createdAt),
                  announcementType: post.announcementType,
                  Data: LexicalRendererPreview({ state: post.parsedPreview }),
                  selectedBranches: post.selectedBranches,
                  csvData: post.csvData ? post.csvData : [],
                  fileName: post.fileName,
                }}
              />
            </div>
          );
        })}

        {loading && <SkeletonCard />}
        {!hasMore && <p className="text-center text-gray-500">No more posts</p>}
      </div>
    </div>
  );
}
