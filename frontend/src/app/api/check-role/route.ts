import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  return NextResponse.json({ role });
}
