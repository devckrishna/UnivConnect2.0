import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { mentor_id } = await req.json();

    const booking = await db.booking.findMany({
      where: {
        mentor_id,
      },
    });

    return NextResponse.json(booking);
  } catch (err) {
    return NextResponse.json({
      message:
        "Error finding the user {GET: api/booking/getmentorbookings}" + err,
    });
  }
}
