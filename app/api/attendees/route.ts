import { NextRequest, NextResponse } from "next/server";
import { registerAttendee, listAttendees } from "../../lib/attendees";

function checkAdmin(req: NextRequest): boolean {
  const key = req.nextUrl.searchParams.get("key");
  return key === process.env.ADMIN_PASSWORD && !!key;
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const attendees = await listAttendees();
    return NextResponse.json({ attendees });
  } catch (err) {
    console.error("[GET /api/attendees]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name ?? "").trim();
    const mobile = (body.mobile ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Mobile must be exactly 10 digits" },
        { status: 400 }
      );
    }

    const result = await registerAttendee(name, mobile);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[POST /api/attendees]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
