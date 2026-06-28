import { NextRequest, NextResponse } from "next/server";
import { deleteAttendee, updateAttendee } from "../../../lib/attendees";

interface Params {
  params: Promise<{ mobile: string }>;
}

function checkAdmin(req: NextRequest): boolean {
  const key = req.nextUrl.searchParams.get("key");
  return key === process.env.ADMIN_PASSWORD && !!key;
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { mobile } = await params;
  try {
    const deleted = await deleteAttendee(mobile);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/attendees/:mobile]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { mobile } = await params;
  try {
    const body = await req.json();
    const patch: { name?: string; mobile?: string } = {};
    if (typeof body.name === "string" && body.name.trim()) {
      patch.name = body.name.trim();
    }
    if (typeof body.mobile === "string" && /^\d{10}$/.test(body.mobile)) {
      patch.mobile = body.mobile;
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    const updated = await updateAttendee(mobile, patch);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/attendees/:mobile]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
