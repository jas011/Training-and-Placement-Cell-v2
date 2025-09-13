import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10");
  const query = searchParams.get("q")?.toLowerCase() || "";
  const branchFilters = searchParams.get("branch")?.split(",").filter(Boolean);
  const typeFilters = searchParams.get("type")?.split(",").filter(Boolean);

  const where: any = {};

  // Search logic
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { announcementType: { contains: query, mode: "insensitive" } },
      { selectedBranches: { has: query } }, // exact match on branch
      {
        createdAt: {
          equals: isNaN(Date.parse(query)) ? undefined : new Date(query),
        },
      },
    ];
    // optional: search inside CSV JSON[]
    // where.OR.push({
    //   csvData: {
    //     hasSome: {
    //       // search all values of JSON[]
    //       value: { contains: query, mode: "insensitive" },
    //     },
    //   },
    // });
  }

  // Filters
  if (branchFilters?.length) {
    where.selectedBranches = { hasSome: branchFilters };
  }
  if (typeFilters?.length) {
    where.announcementType = { in: typeFilters };
  }

  let posts;
  if (cursor) {
    posts = await prisma.post.findMany({
      take: limit,
      skip: 1,
      cursor: { id: cursor },
      orderBy: { createdAt: "desc" },
      where,
      select: {
        id: true,
        title: true,
        announcementType: true,
        selectedBranches: true,
        preview: true,
        createdAt: true,
        csvData: true,
        fileName: true,
      },
    });
  } else {
    posts = await prisma.post.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      where,
      select: {
        id: true,
        title: true,
        announcementType: true,
        selectedBranches: true,
        preview: true,
        createdAt: true,
        csvData: true,
        fileName: true,
      },
    });
  }

  return NextResponse.json(posts);
}
