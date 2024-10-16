import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/db";
import { AnalyticsData, Filters, TotalTimePerFeature } from "@/interfaces";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const queryParams: Filters = {
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    ageGroup: searchParams.get("ageGroup") || undefined,
    gender: searchParams.get("gender") || undefined,
  };

  const query: { [key: string]: unknown } = {};

  if (queryParams.startDate && queryParams.endDate) {
    query.day = {
      $gte: new Date(queryParams.startDate),
      $lte: new Date(queryParams.endDate),
    };
  }

  if (queryParams.ageGroup && queryParams.ageGroup !== "all") {
    query.age = queryParams.ageGroup;
  }

  if (queryParams.gender && queryParams.gender !== "all") {
    query.gender = queryParams.gender.toLowerCase();
  }

  try {
    const client = await clientPromise;
    const db = client.db("rocket");
    const collection = db.collection<AnalyticsData>("analytics");

    const data = await collection.find(query).toArray();

    const totalTimePerFeature: TotalTimePerFeature = data.reduce(
      (acc: TotalTimePerFeature, curr: AnalyticsData) => {
        acc.A += curr.A;
        acc.B += curr.B;
        acc.C += curr.C;
        acc.D += curr.D;
        acc.E += curr.E;
        acc.F += curr.F;
        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
    );

    return NextResponse.json({ totalTimePerFeature, data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}
