import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/db";
import { AnalyticsData } from "@/interfaces";

const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export async function POST(req: NextRequest) {
  try {
    const data: AnalyticsData | AnalyticsData[] = await req.json();

    const records = Array.isArray(data) ? data : [data];

    for (const record of records) {
      const { day, age, gender, A, B, C, D, E, F } = record;

      if (
        !day ||
        !age ||
        !gender ||
        A == null ||
        B == null ||
        C == null ||
        D == null ||
        E == null ||
        F == null
      ) {
        return NextResponse.json(
          { message: "Missing required fields in one or more records" },
          { status: 400 }
        );
      }
    }

    const recordsWithDate = records.map((record) => ({
      ...record,
      day: parseDate(record.day.toString()),
    }));

    const client = await clientPromise;
    const db = client.db("rocket");
    const collection = db.collection("analytics");

    const result = await collection.insertMany(recordsWithDate);

    return NextResponse.json(
      { message: `${result.insertedCount} records inserted successfully` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { message: "Error inserting data" },
      { status: 500 }
    );
  }
}
