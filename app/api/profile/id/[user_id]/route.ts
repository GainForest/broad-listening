import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(
  _: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const { user_id } = await params;

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM proofs WHERE user_id = $1",
      [user_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json(
      { error: "Database error", details: err },
      { status: 500 }
    );
  }
}
