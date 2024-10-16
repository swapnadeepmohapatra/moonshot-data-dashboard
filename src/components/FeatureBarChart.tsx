import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
  Rectangle,
  Label,
} from "recharts";

interface BarData {
  feature: string;
  time: number;
}

interface FeatureBarChartProps {
  data: BarData[];
}

const FeatureBarChart: React.FC<FeatureBarChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data} layout="vertical">
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" tickCount={15}>
        <Label value={"Time Spent"} offset={0} position="insideBottom" />
      </XAxis>
      <YAxis dataKey="feature" type="category">
        <Label angle={270} offset={0} value={"Feature"} />
      </YAxis>
      <Tooltip />
      <Bar
        dataKey="time"
        fill="#8884d8"
        activeBar={<Rectangle fill="#D8B484" stroke="#8884d8" />}
      >
        <LabelList dataKey="time" position="right" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default FeatureBarChart;
