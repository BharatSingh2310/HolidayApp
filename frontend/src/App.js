import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

// Helper to get the ISO week string (YYYY-Wn)
function getISOWeek(date) {
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 4 - (temp.getDay() || 7)); // Thursday in current week
  const yearStart = new Date(temp.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
  return `${temp.getFullYear()}-W${weekNo}`;
}

function isWeekday(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 1 = Monday, 5 = Friday
}

function groupHolidaysByWeek(holidays) {
  // Only consider holidays that are on a weekday
  const weekMap = {};
  holidays.forEach(h => {
    const d = new Date(h.date);
    if (isWeekday(d)) {
      const week = getISOWeek(d);
      weekMap[week] = (weekMap[week] || 0) + 1;
    }
  });
  return weekMap;
}

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [weekMap, setWeekMap] = useState({});

  // Fetch countries
  useEffect(() => {
    axios.get("/api/countries").then(res => setCountries(res.data));
  }, []);

  // Fetch holidays and compute week map
  useEffect(() => {
    if (selectedCountry) {
      axios.get(`/api/holidays/${selectedCountry}/${year}`).then(res => {
        setHolidays(res.data);
        setWeekMap(groupHolidaysByWeek(res.data));
      });
    } else {
      setHolidays([]);
      setWeekMap({});
    }
  }, [selectedCountry, year]);

  // Mark holidays and color weeks
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const dayStr = date.toISOString().split("T")[0];
    let classNames = [];
    // Holiday
    if (holidays.some(h => h.date === dayStr)) {
      classNames.push("holiday-tile");
    }
    // Week highlight
    const week = getISOWeek(date);
    const weekHolidays = weekMap[week] || 0;
    if (weekHolidays >= 2) {
      classNames.push("week-darkgreen");
    } else if (weekHolidays === 1) {
      classNames.push("week-lightgreen");
    }
    return classNames.join(" ");
  };

  return (
    <div style={{ margin: 30 }}>
      <h1>Country Holidays Calendar</h1>
      <div>
        <label>Select Country: </label>
        <select
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
        >
          <option value="">-- Select --</option>
          {countries.map(c => (
            <option key={c.countryCode} value={c.countryCode}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 30 }}>
        <Calendar
          tileClassName={tileClassName}
          onActiveStartDateChange={({ activeStartDate }) =>
            setYear(activeStartDate.getFullYear())
          }
        />
      </div>
      <div style={{ marginTop: 20 }}>
        <b>Legend:</b>
        <ul>
          <li>
            <span style={{
              display: "inline-block",
              width: 16,
              height: 16,
              background: "yellow",
              border: "1px solid #ccc",
              marginRight: 6,
              verticalAlign: "middle"
            }} /> Holiday day
          </li>
          <li>
            <span style={{
              display: "inline-block",
              width: 16,
              height: 16,
              background: "#b7f7b7",
              border: "1px solid #ccc",
              marginRight: 6,
              verticalAlign: "middle"
            }} /> Week with 1 weekday holiday
          </li>
          <li>
            <span style={{
              display: "inline-block",
              width: 16,
              height: 16,
              background: "#3ebf3e",
              border: "1px solid #ccc",
              marginRight: 6,
              verticalAlign: "middle"
            }} /> Week with 2+ weekday holidays
          </li>
        </ul>
      </div>
      <style>
        {`
          .holiday-tile {
            background: yellow !important;
            color: black !important;
          }
          .week-lightgreen {
            box-shadow: 0 0 0 100vw #b7f7b7 inset !important;
            z-index: 1;
          }
          .week-darkgreen {
            box-shadow: 0 0 0 100vw #3ebf3e inset !important;
            z-index: 2;
          }
        `}
      </style>
    </div>
  );
}

export default App;