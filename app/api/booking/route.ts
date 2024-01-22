import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { date, user_id, mentor_id, start_time } = await req.json();

    const booking = await db.booking.create({
      data: {
        date,
        user_id,
        mentor_id,
        start_time,
      },
    });

    return NextResponse.json(booking);
  } catch (err) {
    return NextResponse.json({
      message:
        "Error finding the user {GET: api/user/mentor/creatbooking}" + err,
    });
  }
}
