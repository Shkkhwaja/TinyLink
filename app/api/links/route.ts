import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isValidUrl, isValidCode } from "@/app/utils/validateUrl";
import { generateCode } from "@/app/utils/generateCode";
import type { QueryResult } from "pg";

// ------------------------------------------------------
// GET → Return all links
// ------------------------------------------------------
export async function GET() {
  try {
    const result: QueryResult<any> = await db.query(`
      SELECT code, url, clicks, last_clicked, created_at
      FROM links
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (err) {
    console.error("GET /api/links ERROR:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// ------------------------------------------------------
// POST → Create short link
// ------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const url: string = body.url?.trim() ?? "";
    const customCode: string = body.code?.trim() ?? "";

    // Validate URL
    if (!isValidUrl(url)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Validate custom code
    if (customCode && !isValidCode(customCode)) {
      return NextResponse.json(
        { error: "Invalid code (must be 6–8 alphanumeric chars)" },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // CUSTOM CODE FLOW
    // ------------------------------------------------------
    if (customCode) {
      const exists = await db.query(
        "SELECT code FROM links WHERE code = $1",
        [customCode]
      );

      if ((exists.rowCount ?? 0) > 0) {
        return NextResponse.json(
          { error: "Code already exists" },
          { status: 409 }
        );
      }

      await db.query(
        `INSERT INTO links (code, url, clicks, last_clicked, created_at)
         VALUES ($1, $2, 0, NULL, NOW())`,
        [customCode, url]
      );

      return NextResponse.json(
        {
          code: customCode,
          url,
          clicks: 0,
          last_clicked: null,
          created_at: new Date().toISOString(),
        },
        { status: 201 }
      );
    }

    // ------------------------------------------------------
    // AUTO-GENERATED CODE FLOW
    // ------------------------------------------------------
    let code = generateCode(6);

    for (let i = 0; i < 5; i++) {
      const check = await db.query(
        "SELECT code FROM links WHERE code = $1",
        [code]
      );

      if ((check.rowCount ?? 0) === 0) break;

      code = generateCode(6 + Math.min(i + 1, 2)); // 6 → 7 → 8
    }

    const lastCheck = await db.query(
      "SELECT code FROM links WHERE code = $1",
      [code]
    );

    if ((lastCheck.rowCount ?? 0) > 0) {
      return NextResponse.json(
        { error: "Failed to generate unique code" },
        { status: 500 }
      );
    }

    await db.query(
      `INSERT INTO links (code, url, clicks, last_clicked, created_at)
       VALUES ($1, $2, 0, NULL, NOW())`,
      [code, url]
    );

    return NextResponse.json(
      {
        code,
        url,
        clicks: 0,
        last_clicked: null,
        created_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/links ERROR:", err);
    return NextResponse.json(
      { error: "Server failed while creating link" },
      { status: 500 }
    );
  }
}
