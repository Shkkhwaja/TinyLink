import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { QueryResult } from "pg";

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  try {
    await db.query("BEGIN");

    const selectRes: QueryResult<any> = await db.query(
      "SELECT url FROM links WHERE code = $1 FOR UPDATE",
      [code]
    );

    if (selectRes.rowCount === 0) {
      await db.query("ROLLBACK");
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const url = selectRes.rows[0].url;

    await db.query(
      `UPDATE links 
       SET clicks = clicks + 1, last_clicked = NOW() 
       WHERE code = $1`,
      [code]
    );

    await db.query("COMMIT");

    return NextResponse.redirect(url, 302);
  } catch (err) {
    await db.query("ROLLBACK").catch(() => {});
    console.error("Redirect error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
