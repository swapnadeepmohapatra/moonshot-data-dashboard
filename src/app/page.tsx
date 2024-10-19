"use client";

import FilterBar from "@/components/FilterBar";
import FeatureBarChart from "../components/FeatureBarChart";
import { useDataContext } from "../contexts/DataContext";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { barChartData } = useDataContext();

  const { data } = useSession();

  if (!data?.user) {
    redirect("/auth/signin");
  }

  return (
    <main>
      <Navbar />
      <FilterBar />
      <FeatureBarChart data={barChartData} />
    </main>
  );
}
