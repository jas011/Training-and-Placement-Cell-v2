import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      announcementType: true,
      selectedBranches: true,
      doc: true,
      fileName: true,
      createdAt: true,
      csvData: true,
    },
  });

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: body.title,
      status: body.status,
      announcementType: body.announcementType,
      selectedBranches: body.selectedBranches,
      doc: body.doc,
      preview: body.preview,
      authorId: body.authorId,
      csvData: body.showTable ? body.csvData : [],
      fileName: body.fileName,
    },
  });

  return NextResponse.json(post);
}
