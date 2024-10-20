import { LineData } from "@/interfaces";
import React, { useState, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import styles from "./FilterBar.module.css";

interface HighlightAndZoomLineChartProps {
  data: LineData[];
}

const HighlightAndZoomLineChart: React.FC<HighlightAndZoomLineChartProps> = ({
  data,
}) => {
  const [zoomData, setZoomData] = useState<LineData[]>(data);
  const [startX, setStartX] = useState<number | null>(null);
  const [endX, setEndX] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: any) => {
    if (chartRef.current) {
      const chartPosition = chartRef.current.getBoundingClientRect();
      const xValue = e.clientX - chartPosition.left;
      setStartX(xValue);
    }
  };

  const handleMouseMove = (e: any) => {
    if (startX !== null && chartRef.current) {
      const chartPosition = chartRef.current.getBoundingClientRect();
      const xValue = e.clientX - chartPosition.left;
      setEndX(xValue);
    }
  };

  const handleMouseUp = () => {
    if (startX !== null && endX !== null) {
      const xMin = Math.min(startX, endX);
      const xMax = Math.max(startX, endX);

      const zoomStartIndex = Math.floor(
        (xMin / chartRef.current!.clientWidth) * zoomData.length
      );
      const zoomEndIndex = Math.ceil(
        (xMax / chartRef.current!.clientWidth) * zoomData.length
      );

      setZoomData(data.slice(zoomStartIndex, zoomEndIndex));
    }
    setStartX(null);
    setEndX(null);
  };

  const handleZoomOut = () => {
    setZoomData(data);
  };

  useEffect(() => {
    setZoomData(data);
  }, [data]);

  return (
    <div>
      <button
        onClick={handleZoomOut}
        className={`${styles.filterButton}`}
        style={{
          margin: "1rem",
        }}
      >
        Zoom Out
      </button>
      <div
        ref={chartRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={zoomData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
            />

            {startX !== null && endX !== null && (
              <ReferenceArea
                x1={(startX / chartRef.current!.clientWidth) * data.length}
                x2={(endX / chartRef.current!.clientWidth) * data.length}
                strokeOpacity={0.3}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HighlightAndZoomLineChart;
