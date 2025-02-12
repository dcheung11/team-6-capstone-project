import React, { useState } from "react";

export const LeagueSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date("2025-02-01"));

  const handleNavigation = (direction) => {
    let newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newDate);
  };

  // **Get month and year for display**
  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // **Generate month calendar dates**
  const getMonthDates = (date) => {
    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let firstDayOfWeek = firstDayOfMonth.getDay(); // Sunday = 0
    let totalDays = lastDayOfMonth.getDate();

    let daysArray = [];

    // Fill empty spaces before the first day
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(null);
    }

    // Fill actual days
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(i);
    }

    return daysArray;
  };

  const monthDates = getMonthDates(currentMonth);

  // **Dummy match data for the entire league (February & March 2025)**
  const leagueMatchData = {
    // February 2025
    "2025-02-01": ["Golden Griffins vs Red Rockets (6:00)", "Silver Sharks vs Ivory Irons (7:30)"],
	"2025-02-03": ["Blue Blazers vs Bronze Bears (5:30)", "Emerald Eagles vs Iron Ibis (6:30)"],
	"2025-02-04": ["Onyx Owls vs Amber Falcons (7:30)", "Golden Griffins vs Thunderbolts (6:00)"],
	"2025-02-05": ["Titanium Toucans vs Iron Ibis (5:30)", "Red Rockets vs Magenta Marauders (7:00)"],
	"2025-02-06": ["Emerald Eagles vs Blue Blazers (6:30)", "Silver Sharks vs Crimson Coyotes (7:00)"],
	"2025-02-07": ["Ivory Irons vs Thunderbolts (6:00)", "Bronze Bears vs Onyx Owls (8:00)"],
	"2025-02-08": ["Amber Falcons vs Golden Griffins (5:30)", "Magenta Marauders vs Titanium Toucans (7:30)"],
	"2025-02-09": ["Iron Ibis vs Crimson Coyotes (6:30)", "Blue Blazers vs Silver Sharks (8:00)"],
	"2025-02-10": ["Red Rockets vs Emerald Eagles (6:00)", "Bronze Bears vs Golden Griffins (7:00)"],
	"2025-02-11": ["Thunderbolts vs Blue Blazers (5:30)", "Amber Arrows vs Crimson Coyotes (7:30)"],
	"2025-02-12": ["Magenta Marauders vs Onyx Owls (6:30)", "Titanium Toucans vs Red Rockets (7:00)"],
	"2025-02-14": ["Golden Griffins vs Crimson Coyotes (7:30)", "Emerald Eagles vs Thunderbolts (6:00)"],
	"2025-02-16": ["Red Rockets vs Ivory Irons (5:30)", "Iron Ibis vs Bronze Bears (7:00)"],
	"2025-02-17": ["Silver Sharks vs Thunderbolts (6:30)", "Magenta Marauders vs Emerald Eagles (8:00)"],
	"2025-02-19": ["Titanium Toucans vs Red Rockets (7:00)", "Ivory Irons vs Magenta Marauders (6:30)"],
	"2025-02-20": ["Blue Blazers vs Silver Sharks (5:30)", "Iron Ibis vs Golden Griffins (7:30)"],
	"2025-02-21": ["Amber Falcons vs Thunderbolts (6:00)", "Bronze Bears vs Red Rockets (7:30)"],
	"2025-02-24": ["Amber Falcons vs Bronze Bears (7:00)", "Magenta Marauders vs Golden Griffins (6:00)"],
	"2025-02-25": ["Red Rockets vs Onyx Owls (6:30)", "Ivory Irons vs Crimson Coyotes (7:30)"],
	"2025-02-27": ["Silver Sharks vs Emerald Eagles (6:00)", "Titanium Toucans vs Red Rockets (8:00)"],
	"2025-02-28": ["Golden Griffins vs Thunderbolts (7:30)", "Amber Falcons vs Ivory Irons (6:00)"],

    // March 2025
    "2025-03-01": ["Golden Griffins vs Ivory Irons (6:00)", "Thunderbolts vs Crimson Coyotes (7:00)"],
	"2025-03-02": ["Crimson Coyotes vs Magenta Marauders (7:00)", "Thunderbolts vs Titanium Toucans (6:30)"],
    "2025-03-05": ["Onyx Owls vs Blue Blazers (5:30)", "Silver Sharks vs Emerald Eagles (8:00)"],
    "2025-03-08": ["Red Rockets vs Magenta Marauders (6:00)", "Titanium Toucans vs Amber Arrows (7:30)"],
	"2025-03-10": ["Red Rockets vs Emerald Eagles (6:00)", "Bronze Bears vs Golden Griffins (7:00)"],
    "2025-03-12": ["Ivory Irons vs Bronze Bears (6:30)", "Magenta Marauders vs Onyx Owls (7:00)"],
	"2025-03-13": ["Ivory Irons vs Bronze Bears (6:00)", "Silver Sharks vs Magenta Marauders (8:00)"],
    "2025-03-14": ["Golden Griffins vs Crimson Coyotes (7:30)", "Emerald Eagles vs Thunderbolts (6:00)"],
	"2025-03-15": ["Crimson Coyotes vs Amber Arrows (7:30)", "Golden Griffins vs Thunderbolts (6:30)"],
    "2025-03-18": ["Blue Blazers vs Red Rockets (5:30)", "Bronze Bears vs Magenta Marauders (6:00)"],
    "2025-03-22": ["Amber Arrows vs Golden Griffins (6:00)", "Titanium Toucans vs Silver Sharks (7:00)"],
	"2025-03-24": ["Amber Falcons vs Bronze Bears (7:00)", "Magenta Marauders vs Golden Griffins (6:00)"],
	"2025-03-26": ["Iron Ibis vs Blue Blazers (5:30)", "Thunderbolts vs Magenta Marauders (7:00)"],
  	"2025-03-27": ["Silver Sharks vs Emerald Eagles (6:00)", "Titanium Toucans vs Red Rockets (8:00)"],
  	"2025-03-28": ["Golden Griffins vs Thunderbolts (7:30)", "Amber Falcons vs Ivory Irons (6:00)"],
	"2025-03-30": ["Silver Sharks vs Iron Ibis (5:00)", "Onyx Owls vs Thunderbolts (6:30)"],
  };

  // **Determine matches for the selected month**
  const matchKey = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const leagueMatches = leagueMatchData || {};

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <div style={styles.header}>
        <button style={styles.navButton} onClick={() => handleNavigation("prev")}>Prev</button>
        <h2 style={styles.title}>{monthYear}</h2>
        <button style={styles.navButton} onClick={() => handleNavigation("next")}>Next</button>
      </div>

      {/* League Schedule Calendar */}
      <div style={styles.calendar}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={styles.calendarHeader}>{day}</div>
        ))}
        {monthDates.map((day, index) => {
          let fullDate = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split("T")[0] : null;
          return (
            <div key={index} style={day ? styles.calendarCell : styles.emptyCell}>
              {day && <span style={styles.dateText}>{day}</span>}
              {day && leagueMatches[fullDate]?.map((match, matchIndex) => (
                <p key={matchIndex} style={styles.matchText}>{match}</p>
              ))}
            </div>
          );
        })}
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
