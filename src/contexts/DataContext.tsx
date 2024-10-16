import { BarData, Filters } from "@/interfaces";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface DataContextType {
  barChartData: BarData[];
  fetchData: (filters: Filters) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filters: Filters;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [barChartData, setBarChartData] = useState<BarData[]>([]);
  const [filters, setFilters] = useState<Filters>({
    ageGroup: "",
    gender: "",
    startDate: "",
    endDate: "",
  });

  const fetchData = async (currentFilters: Filters) => {
    const response = await fetch(
      `/api/data?startDate=${currentFilters.startDate}&endDate=${currentFilters.endDate}&ageGroup=${currentFilters.ageGroup}&gender=${currentFilters.gender}`
    );

    const data = await response.json();

    const totalTimePerFeature = data.totalTimePerFeature;

    setBarChartData(
      Object.entries(totalTimePerFeature).map(([feature, time]) => ({
        feature,
        time: Number(time),
      }))
    );
  };

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  return (
    <DataContext.Provider
      value={{ barChartData, fetchData, setFilters, filters }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
