import { useEffect, useState } from "react";
import MufChart from "../components/MufChart";
import { Data } from "../Data/data.js";
// import MongoDbLogo from "../styles/mongodb_logo.svg"; // Я не знаю, как загружать картинки.

// Функция для сбора данных и коллекции Anomalies
export default function Home() {
  const fetchAnomalies = async () => {
    const response = await fetch("/api/getAnomalies");
    const data = await response.json();
    setAnomalies(data);
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  // Нужно для работы с колелкцией Anomalies
  const [anomalies, setAnomalies] = useState([]);

  // Обработка нажатия на график
  const handlePointClick = (point) => {
    setAnomalies((prevAnomalies) => [...prevAnomalies, point]);
  };

  // LocalStorage can't be used w/ Next.js lol
  // Нужно делать проверку window != "undefined", потому что не грузит данные из localStorage *shrug*
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

  // Запись начала промежутка времени в локальное хранилище, чтобы при перезагрузке данные оставались
  const handleStartPeriodChange = (e) => {
    setStartPeriod(e.target.value);
    if (typeof window !== "undefined") {
      localStorage.setItem("startPeriod", e.target.value);
    }
  };
  // Запись конца промежутка в локальное хранилище, чтобы при перезагрузке данные оставались
  const handleEndPeriodChange = (e) => {
    setEndPeriod(e.target.value);
    if (typeof window !== "undefined") {
      localStorage.setItem("endPeriod", e.target.value);
    }
  };

  // Обработка кнопки Добавить\обновить
  const handleUpdateClick = async () => {
    console.log(anomalies);
    const response = await fetch("/api/updateAnomalies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(anomalies),
    });

    if (response.ok) {
      setAnomalies([]);
    } else {
      console.error("Failed to update anomalies");
    }
    await fetchAnomalies();
  };

  // Отрисовка фильтрованного графика
  const userData = {
    labels: filteredData.map((data) => data.time),
    datasets: [
      {
        data: filteredData.map((data) => data.muf),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };

  // Обработка кнопки Delete
  const handleDeleteClick = async (anomalyToDelete) => {
    const response = await fetch("/api/deleteAnomalies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([anomalyToDelete]), // Wrap the anomaly to delete in an array
    });

    if (response.ok) {
      // Remove the deleted anomaly from the local state
      setAnomalies((prevAnomalies) =>
        prevAnomalies.filter(
          (anomaly) =>
            anomaly.muf !== anomalyToDelete.muf ||
            anomaly.time !== anomalyToDelete.time
        )
      );
    } else {
      console.error("Failed to delete anomaly");
    }
  };

  // Отображаемые на странице элементы
  return (
    <div className="App">
      <div id="chartContainer">
        <div
          style={{
            width: 1200,
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          {/* Здесь получаются данные при нажатии на график */}
          <MufChart chartData={userData} onPointClick={handlePointClick} />
        </div>
        <div className="timePeriodSelector">
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
          <div className="elementsDivider"></div>
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
      </div>
      {/* Здесь начинается Div со списком аномалий*/}
      <div id="anomalyContainer" style={{ borderRadius: 10 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textTransform: "uppercase",
            marginLeft: 15,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          Anomaly info:
        </h2>
        <div className="list_btnUpdate">
          <ol style={{ marginLeft: 15 }}>
            {anomalies.map((anomaly, index) => (
              <li style={{ marginBottom: 10 }} key={index}>
                <div className="listEntry">
                  {"MUF: " + anomaly.muf}
                  <br />
                  {"Time: " + anomaly.time}
                  <button
                    className="btnDelete"
                    onClick={() => handleDeleteClick(anomaly)}
                  >
                    x
                  </button>
                </div>
              </li>
            ))}{" "}
          </ol>{" "}
          <button className="btnUpdate" onClick={handleUpdateClick}>
            {/* <img src={MongoDbLogo} /> */}
            Добавить/обновить
          </button>
        </div>
      </div>
    </div>
  );
}
