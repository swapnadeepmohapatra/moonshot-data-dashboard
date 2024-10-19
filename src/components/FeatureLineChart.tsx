import { LineData } from "@/interfaces";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FeatureLineChartProps {
  data: LineData[];
}

const FeatureLineChart: React.FC<FeatureLineChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

export default FeatureLineChart;
