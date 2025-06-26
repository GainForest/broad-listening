import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT user_id, gender FROM proofs WHERE gender IS NOT NULL`
    );

    const groups: Record<string, string[]> = {};

    for (const row of rows) {
      if (!row.user_id || !row.gender) continue;
      const gender = row.gender;
      if (!groups[gender]) groups[gender] = [];
      groups[gender].push(row.user_id);
    }

    return NextResponse.json(groups);
  } catch (err) {
    return NextResponse.json(
      { error: "Database error", details: err },
      { status: 500 }
    );
  }
}
