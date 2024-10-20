"use client";

import FilterBar from "@/components/FilterBar";
import FeatureBarChart from "../components/FeatureBarChart";
import { useDataContext } from "../contexts/DataContext";
import Navbar from "@/components/Navbar";
import { redirect, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import FeatureLineChart from "@/components/FeatureLineChart";

export default function Home() {
  const { barChartData, selectFeature, lineChartData, selectedFeature } =
    useDataContext();

  const searchParams = useSearchParams();

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      if (searchParams.get("filter")) {
        return redirect(
          `/auth/signin?redirect=/?filter=${searchParams.get("filter")}`
        );
      }

      redirect("/auth/signin?redirect=/");
    },
  });

  if (status === "loading") {
    return "Loading...";
  }

  return (
    <main>
      <Navbar />
      <FilterBar />
      <FeatureBarChart data={barChartData} selectFeature={selectFeature} />
      {selectedFeature && (
        <>
          <p
            style={{
              paddingLeft: "1rem",
            }}
          >
            Data for {selectedFeature}:{" "}
          </p>
          <FeatureLineChart data={lineChartData} />
        </>
      )}
    </main>
  );
}
