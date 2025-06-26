import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT user_id, date_of_birth FROM proofs WHERE date_of_birth IS NOT NULL`
    );

    const today = new Date();
    const groups = {
      under_18: [] as string[],
      age_18_25: [] as string[],
      age_25_35: [] as string[],
      age_35_55: [] as string[],
      over_55: [] as string[],
    };
 
    for (const row of rows) {
      const dob = new Date(row.date_of_birth);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 18) groups.under_18.push(row.user_id);
      else if (age < 26) groups.age_18_25.push(row.user_id);
      else if (age < 36) groups.age_25_35.push(row.user_id);
      else if (age < 56) groups.age_35_55.push(row.user_id);
      else groups.over_55.push(row.user_id);
    }

    return NextResponse.json(groups);
  } catch (err) {
    return NextResponse.json(
      { error: "Database error", details: err },
      { status: 500 }
    );
  }
}
