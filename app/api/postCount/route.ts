import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET(req: Request) {
  const postsCount = await prisma.post.count();

  return NextResponse.json(postsCount);
}
