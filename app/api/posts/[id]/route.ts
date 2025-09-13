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
      status: true,
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const post = await prisma.post.update({
    where: { id },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
   const { id } = await params;

    // Delete post by ID
    const deleted = await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Post deleted successfully", post: deleted },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Delete error:", error);

    if (error.code === "P2025") {
      // Record not found
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
