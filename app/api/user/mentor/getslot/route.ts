import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    const slot = await db.slot.findFirst({
      where: {
        user_id: user?.id,
      },
    });
    return NextResponse.json(slot);
  } catch (err) {
    return NextResponse.json({
      message: "Error finding the user {GET: api/user/mentor/getslot}" + err,
    });
  }
}
