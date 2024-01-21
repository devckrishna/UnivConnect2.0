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
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({
      message:
        "Error finding the user {GET: api/user/mentor/getuserbyemail}" + err,
    });
  }
}
