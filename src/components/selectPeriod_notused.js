import { useEffect, useState } from "react";

export function selectPeriod() {
  const [startPeriod, setStartPeriod] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("startPeriod") || ""
      : ""
  );
  const [endPeriod, setEndPeriod] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("endPeriod") || "" : ""
  );
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const startIndex = Data.findIndex((data) => data.time === startPeriod);
    const endIndex = Data.findIndex((data) => data.time === endPeriod);
    const newFilteredData = Data.slice(startIndex, endIndex + 1);
    setFilteredData(newFilteredData);
  }, [startPeriod, endPeriod]);

  const handleStartPeriodChange = (e) => {
    setStartPeriod(e.target.value);
    if (typeof window !== "undefined") {
      localStorage.setItem("startPeriod", e.target.value);
    }
  };

  const handleEndPeriodChange = (e) => {
    setEndPeriod(e.target.value);
    if (typeof window !== "undefined") {
      localStorage.setItem("endPeriod", e.target.value);
    }
  };

  return (
    <div>
      <select
        id="timePeriod-start"
        value={startPeriod}
        onChange={handleStartPeriodChange}
      >
        <option value="0">Выберите начало промежутка</option>
        {Data.map((data, index) => (
          <option key={index} value={data.time}>
            {data.time}
          </option>
        ))}
      </select>
      <select
        id="timePeriod-end"
        value={endPeriod}
        onChange={handleEndPeriodChange}
      >
        <option value="0">Выберите конец промежутка</option>
        {Data.map((data, index) => (
          <option key={index} value={data.time}>
            {data.time}
          </option>
        ))}
      </select>
    </div>
  );
}
