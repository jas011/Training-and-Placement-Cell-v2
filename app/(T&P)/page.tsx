"use client";

import { useState, useEffect } from "react";
import { useIntersectionObserver } from "react-haiku";
import clsx from "clsx";
import Card from "../components/card";
import { parseDate } from "@/app/utilities/dataParse";
import { docFromHash } from "@/components/editor/utils/doc-serialization";
import { LexicalRendererPreview } from "@/app/utilities/render";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Funnel } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "react-haiku";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { BotMessageSquare } from "@/components/animate-ui/icons/bot-message-square";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";
import { SkeletonCard } from "../components/Skeleton";
import Members from "../components/Member";

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

const branchOptions = [
  { value: "cse", label: "CSE" },
  { value: "it", label: "IT" },
  { value: "ce", label: "CE" },
  { value: "ee", label: "EE" },
  { value: "ece", label: "ECE" },
  { value: "mba", label: "MBA" },
  { value: "me", label: "ME" },
];

const postTypeOptions = [
  { value: "Hackathon Announcement", label: "Hackathon" },
  { value: "Placement Announcement", label: "Placement" },
  { value: "Internship Announcement", label: "Internship" },
  { value: "Event Announcement", label: "Event" },
  { value: "Others Announcement", label: "Others" },
];

// -----------------------------
// Skeleton Loader for Post Card
// -----------------------------

export default function PostsPage() {
  const [posts, setPosts] = useState<Map<string, Post>>(new Map());
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const debouncedValue = useDebounce(search, 1000);

  const { observeRef, isVisible } = useIntersectionObserver({
    animateOnce: false,
    options: { threshold: 0.5, rootMargin: "-50% 0px 0% 0px" },
  });

  useEffect(() => {
    if (isVisible && hasMore) loadMore();
  }, [isVisible]);

  useEffect(() => {
    loadMore(true);
  }, [debouncedValue]);

  const loadMore = async (reset = false) => {
    setLoading(true);

    const params = new URLSearchParams({
      limit: "10",
      ...(cursor && !reset ? { cursor } : {}),
      ...(search ? { q: search } : {}),
      ...(selectedBranches.length
        ? { branch: selectedBranches.join(",") }
        : {}),
      ...(selectedTypes.length ? { type: selectedTypes.join(",") } : {}),
    });

    const res = await fetch(`/api/posts?${params.toString()}`);
    const data: Post[] = await res.json();

    if (reset) {
      setPosts(new Map());
      setCursor(null);
      setHasMore(true);
    }

    if (data.length > 0) {
      const parsed = await Promise.all(
        data.map(async (p) => ({
          ...p,
          parsedPreview: await docFromHash(p.preview),
        }))
      );

      setPosts((prev) => {
        const next = new Map(reset ? [] : prev);
        for (const p of parsed) next.set(p.id, p);
        return next;
      });
      setCursor(data[data.length - 1].id);
    } else setHasMore(false);

    setLoading(false);
    setInitialLoading(false);
  };

  // Reset when filters/search change
  useEffect(() => {
    loadMore(true);
  }, [selectedBranches, selectedTypes]);

  const toggleBranch = (branch: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // ---------------- UI ----------------
  return (
    <>
      <div className="md:grid md:grid-cols-3 justify-items-center w-full relative gap-6">
        <div></div>
        <div>
          <div className="flex justify-center flex-col w-full items-center mb-12">
            <div className="w-full max-w-2xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                Welcome to the Training & Placement Cell
              </h1>
              <p className="leading-7 text-muted-foreground">
                Stay updated with the latest placements, internships, and T&P
                events.
              </p>

              <div className="flex gap-2 my-6">
                <Input
                  placeholder="Search posts, companies, or opportunities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {/* Drawer stays mounted always */}
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      className="w-fit rounded-sm border"
                      variant="secondary"
                    >
                      Filter by <Funnel className="ml-1 h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="items-center">
                    <DrawerHeader>
                      <DrawerTitle className="md:text-[20px]">
                        Choose your filter rules
                      </DrawerTitle>
                      <DrawerDescription className="md:text-[14px]">
                        Pick options to refine results
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-4 text-muted-foreground px-6 py-2 items-center">
                      <div className="flex gap-1 flex-col">
                        <span className="whitespace-nowrap ">Branch:</span>
                        <div className="flex gap-2 text-muted-foreground flex-wrap">
                          {branchOptions.map((branch) => (
                            <Badge
                              key={branch.value}
                              onClick={() => toggleBranch(branch.value)}
                              className={clsx(
                                "md:text-[16px] cursor-pointer flex flex-row items-center justify-center gap-[10px] w-min h-min px-[15px] py-[6px] relative overflow-hidden rounded-[22px] backdrop-blur border border-solid border-[rgba(179,179,179,0.47)]",
                                selectedBranches.includes(branch.value)
                                  ? "bg-gray-200 text-foreground"
                                  : "bg-transparent text-muted-foreground"
                              )}
                            >
                              {branch.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-col">
                        <span className="whitespace-nowrap">Post Type:</span>
                        <div className="flex gap-2 text-muted-foreground flex-wrap">
                          {postTypeOptions.map((post) => (
                            <Badge
                              key={post.value}
                              onClick={() => toggleType(post.value)}
                              className={clsx(
                                "md:text-[16px] cursor-pointer flex flex-row items-center justify-center gap-[10px] w-min h-min px-[15px] py-[6px] relative overflow-hidden rounded-[22px] backdrop-blur border border-solid border-[rgba(179,179,179,0.47)]",
                                selectedTypes.includes(post.value)
                                  ? "bg-gray-200 text-foreground"
                                  : "bg-transparent text-muted-foreground"
                              )}
                            >
                              {post.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DrawerFooter className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedBranches([]);
                          setSelectedTypes([]);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            <div className="w-full max-w-2xl mx-auto flex flex-col gap-5 px-4">
              {/* Initial loading */}
              {initialLoading &&
                Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}

              {/* No results */}
              {!initialLoading && posts.size === 0 && (
                <div className="text-center text-gray-500 py-10 flex flex-col items-center w-full">
                  <AnimateIcon animateOnHover>
                    <BotMessageSquare height={92} width={92} />
                  </AnimateIcon>
                  <p>No opportunities match your filters.</p>
                </div>
              )}

              {/* Posts */}
              {Array.from(posts.values()).map((post, i) => {
                const isLast = i === Array.from(posts.keys()).length - 1;
                return (
                  <div
                    key={post.id}
                    ref={isLast ? (observeRef as any) : null}
                    className="animate-[fadeIn_0.4s_ease-in-out]"
                  >
                    <Card
                      id={post.id}
                      title={post.title}
                      date={parseDate(post.createdAt)}
                      announcementType={post.announcementType}
                      Data={LexicalRendererPreview({
                        state: post.parsedPreview,
                      })}
                      selectedBranches={post.selectedBranches}
                      csvData={post.csvData || []}
                      fileName={post.fileName}
                    />
                  </div>
                );
              })}

              {/* Loader */}
              {loading && !initialLoading && <SkeletonCard />}

              {/* End of feed */}
              {!hasMore && posts.size > 0 && (
                <p className="text-center text-gray-500 py-6">
                  🎉 You’re all caught up!
                </p>
              )}
            </div>
          </div>
        </div>
        <Members />
      </div>
      <ProgressiveBlur
        position="bottom"
        backgroundColor="#f5f4f3"
        className="fixed"
        height="105px"
      />
    </>
  );
}
