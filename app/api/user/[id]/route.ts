import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({
      data: {
        user,
      },
    });
  } catch (err) {
    return NextResponse.json({
      message: "Error finding the user {GET: api/user/id}",
      error: err,
    });
  }
}
