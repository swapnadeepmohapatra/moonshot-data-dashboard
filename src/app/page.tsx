"use client";

import FeatureBarChart from "../components/FeatureBarChart";
import { useDataContext } from "../contexts/DataContext";

export default function Home() {
  const { barChartData } = useDataContext();

  return (
    <div>
      <h2>Feature Time Spent</h2>
      <FeatureBarChart data={barChartData} />
    </div>
  );
}
