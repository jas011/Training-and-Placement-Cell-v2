// /api/posts/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const query = searchParams.get("q")?.toLowerCase() || "";
  const branchFilters = searchParams.get("branch")?.split(",").filter(Boolean);
  const typeFilters = searchParams.get("type")?.split(",").filter(Boolean);
  let dashboardData: any = searchParams.get("isDash");
  if (dashboardData === null) dashboardData = true;
  else dashboardData = false;

  const where: any = {};

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { announcementType: { contains: query, mode: "insensitive" } },
      { selectedBranches: { has: query } },
    ];
  }

  if (branchFilters?.length)
    where.selectedBranches = { hasSome: branchFilters };
  if (typeFilters?.length) where.announcementType = { in: typeFilters };
  if (dashboardData) where.status = "published";

  const posts = await prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    where,
    select: {
      id: true,
      title: true,
      announcementType: true,
      selectedBranches: true,
      preview: dashboardData,
      createdAt: true,
      csvData: dashboardData,
      fileName: dashboardData,
      status: true,
    },
  });

  return NextResponse.json(posts);
}
