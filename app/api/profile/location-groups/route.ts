import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT user_id, address3 FROM proofs WHERE address3 IS NOT NULL`
    );

    const groups: Record<string, string[]> = {};

    for (const row of rows) {
      if (!row.user_id || !row.address3) continue;
      const address3 = row.address3;
      if (!groups[address3]) groups[address3] = [];
      groups[address3].push(row.user_id);
    }

    return NextResponse.json(groups);
  } catch (err) {
    return NextResponse.json(
      { error: "Database error", details: err },
      { status: 500 }
    );
  }
} 