import React, { useState } from "react";

export const TeamSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Function to change months
  const handleNavigation = (direction) => {
    let newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newDate);
  };

  // Get the month and year for display
  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // **Generate a grid for the entire month**
  const getMonthDates = (date) => {
    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    let firstDayOfWeek = firstDayOfMonth.getDay(); // Sunday = 0, Monday = 1, etc.
    let totalDays = lastDayOfMonth.getDate();
    
    let daysArray = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  const monthDates = getMonthDates(currentMonth);

  // **Dummy match data for different months**
  const matchData = {
    "January 2025": {
      2: "Bronze Bears vs Ivory Irons (5:00)",
      7: "Bronze Bears vs Ivory Irons (6:30)",
      15: "Bronze Bears vs Silver Sharks (6:30)",
      19: "Bronze Bears vs Crimson Coyotes (5:00)",
      28: "Bronze Bears vs Onyx Owls (6:30)",
    },
    "February 2025": {
      3: "Bronze Bears vs Red Rockets (7:00)",
      10: "Bronze Bears vs Thunderbolts (6:30)",
      16: "Bronze Bears vs Silver Sharks (6:30)",
      22: "Bronze Bears vs Golden Griffins (5:30)",
      27: "Bronze Bears vs Thunderbolts (8:00)",
    },
    "March 2025": {
      4: "Bronze Bears vs Thunderbolts (6:00)",
      9: "Bronze Bears vs Blue Blazers (7:30)",
      14: "Bronze Bears vs Ivory Irons (6:30)",
      20: "Bronze Bears vs Emerald Eagles (5:00)",
      26: "Bronze Bears vs Blue Blazers (7:00)",
    },
  };

  // **Determine which month's data to show**
  const matchKey = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const matchSchedule = matchData[matchKey] || {};

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <div style={styles.header}>
        <button style={styles.navButton} onClick={() => handleNavigation("prev")}>Prev</button>
        <h2 style={styles.title}>{monthYear}</h2>
        <button style={styles.navButton} onClick={() => handleNavigation("next")}>Next</button>
      </div>

      {/* Team Schedule Calendar */}
      <div style={styles.calendar}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={styles.calendarHeader}>{day}</div>
        ))}
        {monthDates.map((day, index) => (
          <div key={index} style={day ? styles.calendarCell : styles.emptyCell}>
            {day && <span style={styles.dateText}>{day}</span>}
            {day && matchSchedule[day] && <p style={styles.matchText}>{matchSchedule[day]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: { padding: "20px", fontFamily: "'Segoe UI', sans-serif", color: "#7A003C" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "24px", fontWeight: "bold", textAlign: "center" },
  navButton: { backgroundColor: "#7A003C", color: "white", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer" },
  calendar: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", border: "1px solid #7A003C" },
  calendarHeader: { backgroundColor: "#7A003C", color: "white", textAlign: "center", padding: "10px", fontWeight: "bold" },
  calendarCell: { border: "1px solid #7A003C", padding: "10px", textAlign: "center", minHeight: "60px", position: "relative" },
  emptyCell: { border: "1px solid #D3D3D3", backgroundColor: "#E0E0E0", minHeight: "60px" },
  dateText: { fontWeight: "bold", fontSize: "14px", color: "#7A003C" },
  matchText: { fontSize: "12px", color: "#7A003C", fontWeight: "bold", marginTop: "5px" },
};