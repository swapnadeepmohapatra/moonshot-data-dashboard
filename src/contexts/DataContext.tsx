import { AnalyticsData, BarData, Filters, LineData } from "@/interfaces";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { Feature } from "@/enums";

interface DataContextType {
  barChartData: BarData[];
  fetchData: (filters: Filters) => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filters: Filters;
  getShareableLink: () => string;
  selectedFeature: string | null;
  selectFeature: (feature: string) => void;
  lineChartData: LineData[];
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
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [completeData, setCompleteData] = useState<AnalyticsData[]>([]);

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

    setCompleteData(data.data);
  };

  useEffect(() => {
    const parseFiltersFromQuery = (): Filters => {
      const filterParam = searchParams.get("filter");
      if (filterParam) {
        try {
          const parsedFilters: Filters = JSON.parse(
            decodeURIComponent(filterParam)
          );
          return {
            ageGroup: parsedFilters.ageGroup || "",
            gender: parsedFilters.gender || "",
            startDate: parsedFilters.startDate || "",
            endDate: parsedFilters.endDate || "",
          };
        } catch (error) {
          console.error("Failed to parse filters from query:", error);
        }
      }
      return {
        ageGroup: "",
        gender: "",
        startDate: "",
        endDate: "",
      };
    };

    const queryFilters = parseFiltersFromQuery();

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
    const filterObject = {
      ageGroup: filters.ageGroup || "",
      gender: filters.gender || "",
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
    };
    const filterString = encodeURIComponent(JSON.stringify(filterObject));
    return `${window.location.origin}/?filter=${filterString}`;
  };

  const selectFeature = (feature: string) => {
    setSelectedFeature(feature);
  };

  const getSelectedFeatureData = () => {
    if (selectedFeature) {
      return completeData.map((data: AnalyticsData) => ({
        day: new Date(data.day).toLocaleDateString(),
        value: data[selectedFeature as Feature],
      }));
    }
    return [];
  };

  return (
    <DataContext.Provider
      value={{
        barChartData,
        fetchData,
        setFilters,
        filters,
        getShareableLink,
        selectedFeature,
        selectFeature,
        lineChartData: getSelectedFeatureData(),
      }}
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
