import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { cost, user_id, timings } = await req.json();

    const currSlot = await db.slot.findFirst({
      where: {
        user_id: user_id,
      },
    });
    let slot;
    if (currSlot) {
      slot = await db.slot.update({
        where: {
          user_id: user_id,
        },
        data: {
          cost,
          user_id,
          timings,
        },
      });
    } else {
      slot = await db.slot.create({
        data: {
          cost,
          user_id,
          timings,
        },
      });
    }

    return NextResponse.json(slot);
  } catch (err) {
    return NextResponse.json({
      message: "Error finding the user {GET: api/user/mentor/createslot}" + err,
    });
  }
}
