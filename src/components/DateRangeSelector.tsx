import { DateRange, RangeKeyDict } from "react-date-range";
import { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DateRangeSelection {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface DateRangeSelectorProps {
  onDateChange: (startDate: string, endDate: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateChange,
}) => {
  const [range, setRange] = useState<DateRangeSelection[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  const handleSelect = (ranges: RangeKeyDict) => {
    const { selection } = ranges;

    const updatedSelection = {
      startDate: selection.startDate || new Date(),
      endDate: selection.endDate || new Date(),
      key: selection.key || "selection",
    };
    setRange([updatedSelection]);
    onDateChange(
      updatedSelection.startDate.getTime().toString(),
      updatedSelection.endDate.getTime().toString()
    );
  };

  return <DateRange ranges={range} onChange={handleSelect} />;
};

export default DateRangeSelector;
