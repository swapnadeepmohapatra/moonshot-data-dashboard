"use client";

import FilterBar from "@/components/FilterBar";
import FeatureBarChart from "../components/FeatureBarChart";
import { useDataContext } from "../contexts/DataContext";

export default function Home() {
  const { barChartData } = useDataContext();

  return (
    <main>
      <h2>Feature Time Spent</h2>
      <FilterBar />
      <FeatureBarChart data={barChartData} />
    </main>
  );
}
