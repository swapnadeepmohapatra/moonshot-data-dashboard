import { BarData, Filters } from "@/interfaces";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

interface DataContextType {
  barChartData: BarData[];
  fetchData: (filters: Filters) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filters: Filters;
  getShareableLink: () => string;
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
  const searchParams = useSearchParams();
  const [initializedFromQuery, setInitializedFromQuery] = useState(false);

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
    const queryFilters: Filters = {
      ageGroup: searchParams.get("ageGroup")
        ? String(searchParams.get("ageGroup"))
        : "",
      gender: searchParams.get("gender")
        ? String(searchParams.get("gender"))
        : "",
      startDate: searchParams.get("startDate")
        ? String(searchParams.get("startDate"))
        : "",
      endDate: searchParams.get("endDate")
        ? String(searchParams.get("endDate"))
        : "",
    };

    if (
      queryFilters.ageGroup ||
      queryFilters.gender ||
      queryFilters.startDate ||
      queryFilters.endDate
    ) {
      setFilters(queryFilters);
      setInitializedFromQuery(true);
      setTimeout(() => {
        fetchData(queryFilters);
      }, 500);
    } else {
      const savedFilters = Cookies.get("filters");
      if (savedFilters) {
        const parsedFilters: Filters = JSON.parse(savedFilters);
        if (
          parsedFilters.ageGroup ||
          parsedFilters.gender ||
          parsedFilters.startDate ||
          parsedFilters.endDate
        ) {
          setFilters(parsedFilters);
          setTimeout(() => {
            fetchData(parsedFilters);
          }, 500);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!initializedFromQuery) {
      const filtersString = JSON.stringify(filters);
      Cookies.set("filters", filtersString, { expires: 7 });
    }
  }, [filters, initializedFromQuery]);

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  const getShareableLink = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("ageGroup", filters.ageGroup || "");
    searchParams.set("gender", filters.gender || "");
    searchParams.set("startDate", filters.startDate || "");
    searchParams.set("endDate", filters.endDate || "");
    return `${window.location.origin}/?${searchParams.toString()}`;
  };

  return (
    <DataContext.Provider
      value={{ barChartData, fetchData, setFilters, filters, getShareableLink }}
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
