import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM proofs");
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json(
      { error: "Database error", details: err },
      { status: 500 }
    );
  }
}
