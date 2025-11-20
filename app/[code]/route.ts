import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ code: string }> } 
) {
  const { code } = await context.params; 

  try {
    const result = await db.query(
      "SELECT url, clicks FROM links WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return NextResponse.redirect(new URL("/404", req.url));
    }

    const url = result.rows[0].url;

    // Increment clicks & update last_clicked
    await db.query(
      `UPDATE links 
       SET clicks = clicks + 1, last_clicked = NOW()
       WHERE code = $1`,
      [code]
    );

    return NextResponse.redirect(url);
  } catch (err) {
    console.error("Redirect error:", err);
    return NextResponse.redirect(new URL("/500", req.url));
  }
}
