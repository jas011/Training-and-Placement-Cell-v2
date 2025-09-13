"use client";

import { useState, useEffect } from "react";

import clsx from "clsx";
import { parseDate } from "@/app/utilities/dataParse";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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
import { Funnel, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "react-haiku";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";

interface CSVRow {
  [key: string]: string;
}

// extend Post with status field
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
  status: "draft" | "published";
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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);

  const debouncedValue = useDebounce(search, 1000);

  const LIMIT = 2;
  const totalPages = Math.ceil(totalPosts / LIMIT);

  useEffect(() => {
    fetchTotal();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, debouncedValue, selectedBranches, selectedTypes]);

  const fetchTotal = async () => {
    const res = await fetch("/api/postCount");
    const count = await res.json();
    setTotalPosts(count);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: LIMIT.toString(),
      isDash: "true",
      ...(debouncedValue ? { q: debouncedValue } : {}),
      ...(selectedBranches.length
        ? { branch: selectedBranches.join(",") }
        : {}),
      ...(selectedTypes.length ? { type: selectedTypes.join(",") } : {}),
    });
    const res = await fetch(`/api/page?${params.toString()}`);
    const data: Post[] = await res.json();
    setPosts(data);
    setLoading(false);
  };

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

  const handleAction = async (action: string, post: Post) => {
    if (action === "delete") {
      await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } else if (action === "toggleStatus") {
      const newStatus = post.status === "draft" ? "published" : "draft";
      await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
      );
    } else if (action === "edit") {
      window.location.href = `/dashboard/editor/edit/${post.id}`;
    } else if (action === "preview") {
      window.open(`/post/${post.id}`, "_blank");
    }
  };

  return (
    <>
      <div className="flex justify-center flex-col w-full items-center mb-12">
        <div className="w-full max-w-5xl mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Manage Posts
          </h1>

          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="w-fit rounded-sm border" variant="secondary">
                  Filter <Funnel className="ml-1 h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="items-center">
                <DrawerHeader>
                  <DrawerTitle>Choose your filter rules</DrawerTitle>
                  <DrawerDescription>
                    Pick options to refine results
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 text-muted-foreground px-6 py-2 items-center">
                  <div>
                    <span>Branch:</span>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {branchOptions.map((branch) => (
                        <Badge
                          key={branch.value}
                          onClick={() => toggleBranch(branch.value)}
                          className={clsx(
                            "cursor-pointer",
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
                  <div>
                    <span>Post Type:</span>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {postTypeOptions.map((post) => (
                        <Badge
                          key={post.value}
                          onClick={() => toggleType(post.value)}
                          className={clsx(
                            "cursor-pointer",
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

          {/* Table */}
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-2">S.No</th>
                  <th className="px-4 py-2">Post ID</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">
                      <Skeleton className="h-6 w-1/2 mx-auto" />
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  posts.map((post, i) => (
                    <tr key={post.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-2">
                        {(page - 1) * LIMIT + (i + 1)}
                      </td>
                      <td className="px-4 py-2">{post.id}</td>
                      <td className="px-4 py-2">
                        {post.title.slice(0, 30)}...
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={
                            post.status === "published" ? "default" : "outline"
                          }
                        >
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">{parseDate(post.createdAt)}</td>
                      <td className="px-4 py-2 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={"start"} side={"right"}>
                            <DropdownMenuItem
                              onClick={() => handleAction("preview", post)}
                            >
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("edit", post)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("toggleStatus", post)}
                            >
                              {post.status === "draft"
                                ? "Publish"
                                : "Revert to Draft"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("delete", post)}
                              className="text-red-500"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {totalPages > 5 && <PaginationEllipsis />}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
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
