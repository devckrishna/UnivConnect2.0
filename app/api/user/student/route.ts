import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const users = await db.user.findMany({
      where: {
        isMentor: false,
      },
    });
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({
      message: "Error finding the user {GET: api/user/student}",
    });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, description, country, image, gender, isMentor } =
      await req.json();

    const newMentor = await db.user.create({
      data: {
        name,
        email,
        description,
        country,
        image,
        gender,
        isMentor,
      },
    });
    return NextResponse.json({ message: "Created Mentor", data: newMentor });
  } catch (err) {
    return NextResponse.json({
      message: "Error creating the user {POST: api/user/student}",
      error: err,
    });
  }
}
