import React, { useState } from "react";
import DateRangeSelector from "./DateRangeSelector";
import styles from "./FilterBar.module.css";
import { useDataContext } from "@/contexts/DataContext";

function FilterBar() {
  const { setFilters, filters } = useDataContext();
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);

  const openDateSelector = () => {
    setIsDateDialogOpen(true);
  };

  const closeDateSelector = () => {
    setIsDateDialogOpen(false);
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, ageGroup: e.target.value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      ageGroup: "",
      gender: "",
    });
  };

  return (
    <div className={styles.filterBarContainer}>
      <div className={styles.filterBar}>
        <button className={styles.filterButton} onClick={openDateSelector}>
          {filters.startDate && filters.endDate ? (
            <>
              {new Date(parseInt(filters.startDate)).toDateString()} -{" "}
              {new Date(parseInt(filters.endDate)).toDateString()}
            </>
          ) : (
            "Select Date"
          )}
        </button>

        <select
          className={styles.filterDropdown}
          value={filters.ageGroup || ""}
          onChange={handleAgeChange}
        >
          <option value="">Select Age</option>
          <option value="15-25">15-25</option>
          <option value=">25">{">"}25</option>
        </select>

        <select
          className={styles.filterDropdown}
          value={filters.gender || ""}
          onChange={handleGenderChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {isDateDialogOpen && (
          <div className={styles.dialogOverlay}>
            <div className={styles.dialogContent}>
              <button
                className={styles.closeButton}
                onClick={closeDateSelector}
              >
                X
              </button>
              <DateRangeSelector onDateChange={handleDateChange} />
            </div>
          </div>
        )}
        <button className={styles.filterButton} onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
      <div>
        <button className={styles.filterButton}>Share</button>
      </div>
    </div>
  );
}

export default FilterBar;
