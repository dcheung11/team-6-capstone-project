import React, { useState } from "react";
import ReschedulePopup from "./ReschedulePopup";

// Dummy match data for the weekly schedule
const matchData = {
  "2025-02-23": "Crimson Coyotes vs Blue Blazers (7:00)",
  "2025-02-24": "Onyx Owls vs Amber Falcons (6:30)",
  "2025-02-25": "Bronze Bears vs Red Rockets (6:00)",
  "2025-02-26": "Magenta Marauders vs Ivory Irons (7:00)",
  "2025-02-27": "Golden Griffins vs Thunderbolts (8:00)",
  "2025-02-28": "Emerald Eagles vs Iron Ibis (5:30)",
  "2025-02-29": "Silver Sharks vs Crimson Coyotes (7:30)",
};

// Fix the "day ahead" issue by normalizing date/time
function getLocalISODate(date) {
  date.setHours(12, 0, 0, 0);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

export const WeeklySchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date("2025-02-23"));
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");

  const handleNavigation = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  // Creates array Sunday-Saturday
  const getWeekDates = (date) => {
    let startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return [...Array(7)].map((_, i) => {
      let dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const fullDate = getLocalISODate(dayDate);
      return {
        day: dayDate.toLocaleDateString("en-US", { weekday: "long" }),
        date: dayDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        fullDate,
      };
    });
  };

  // Display "Feb 23 - Mar 1, 2025"
  const getWeekRange = (date) => {
    let startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startStr = startOfWeek.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    const endStr = endOfWeek.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  const weekDates = getWeekDates(currentDate);
  const weekRange = getWeekRange(currentDate);

  const handleRescheduleClick = (dateKey, match) => {
    setSelectedDate(dateKey);
    setSelectedMatch(match);
    setShowModal(true);
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <div style={styles.header}>
        <button style={styles.navButton} onClick={() => handleNavigation("prev")}>
          Prev
        </button>
        <h2 style={styles.title}>{weekRange}</h2>
        <button style={styles.navButton} onClick={() => handleNavigation("next")}>
          Next
        </button>
      </div>

      {/* Weekly Schedule Grid */}
      <div style={styles.calendar}>
        {weekDates.map((date, index) => {
          const match = matchData[date.fullDate];
          return (
            <div key={index} style={styles.calendarCard}>
              <h4 style={styles.calendarDay}>{date.day}</h4>
              <p style={styles.calendarDate}>{date.date}</p>
              <p style={styles.eventText}>{match || "No Matches"}</p>
              {match && (
                <button
                  style={styles.rescheduleButton}
                  onClick={() => handleRescheduleClick(date.fullDate, match)}
                >
                  Reschedule
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Reschedule Modal */}
      {showModal && (
        <ReschedulePopup
          selectedDate={selectedDate}
          selectedMatch={selectedMatch}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default WeeklySchedule;

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#7A003C",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  navButton: {
    backgroundColor: "#7A003C",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "15px",
    marginBottom: "20px",
  },
  calendarCard: {
    border: "1px solid #D3D3D3",
    borderRadius: "5px",
    padding: "10px",
    backgroundColor: "#F5F5F5",
    textAlign: "center",
    position: "relative",
  },
  calendarDay: {
    fontWeight: "bold",
    color: "#7A003C",
  },
  calendarDate: {
    fontSize: "14px",
    color: "#4F4F4F",
  },
  eventText: {
    fontSize: "12px",
    color: "#7A003C",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  rescheduleButton: {
    backgroundColor: "#FFC72C",
    color: "#7A003C",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};