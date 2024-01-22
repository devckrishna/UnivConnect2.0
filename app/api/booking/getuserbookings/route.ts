import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    const booking = await db.booking.findMany({
      where: {
        user_id,
      },
    });

    return NextResponse.json(booking);
  } catch (err) {
    return NextResponse.json({
      message:
        "Error finding the user {GET: api/booking/getuserbookings}" + err,
    });
  }
}
