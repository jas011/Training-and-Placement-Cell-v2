import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/posts?cursor=xyz&limit=10
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor"); // last post id
  const limit = parseInt(searchParams.get("limit") || "10");

  let posts;
  if (cursor) {
    posts = await prisma.post.findMany({
      take: limit,
      skip: 1, // skip cursor itself
      cursor: { id: cursor },
      orderBy: { createdAt: "desc" },
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

// POST /api/posts Creation Of Data
export async function POST(req: Request) {
  const body = await req.json();

  console.log(body);

  const post = await prisma.post.create({
    data: {
      id: body.id,
      title: body.title,
      status: body.status,
      announcementType: body.announcementType,
      selectedBranches: body.selectedBranches,
      doc: body.doc,
      preview: body.preview,
      authorId: body.authorId,
      csvData: body.csvData,
      fileName: body.fileName,
    },
  });

  return NextResponse.json(post);
}
