import React, { useState } from "react";

export const WeeklySchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigation = (direction) => {
    let newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7)); // Move by 7 days
    setCurrentDate(newDate);
  };

  // **Generate dynamic week range**
  const getWeekRange = (date) => {
    let startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to Sunday
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Saturday

    let startDay = startOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    let endDay = endOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return `${startDay} - ${endDay}`;
  };

  const weekRange = getWeekRange(currentDate);

  // **Dynamically generate week dates (Sunday to Saturday)**
  const getWeekDates = (date) => {
    let startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Move to Sunday

    return [...Array(7)].map((_, i) => {
      let dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      return {
        day: dayDate.toLocaleDateString("en-US", { weekday: "long" }),
        date: dayDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }), // Example: "12 May"
        fullDate: dayDate.toISOString().split("T")[0], // Example: "2025-05-12"
      };
    });
  };

  const weekDates = getWeekDates(currentDate);

  // **Dummy match data for February & March 2025**
  const matchData = {
    // February 2025
    "2025-02-02": "Crimson Coyotes vs Magenta Marauders (7:00)",
    "2025-02-05": "Onyx Owls vs Amber Falcons (7:30)",
    "2025-02-08": "Ivory Irons vs Golden Griffins (6:00)",
    "2025-02-10": "Emerald Eagles vs Thunderbolts (8:00)",
    "2025-02-14": "Thunderbolts vs Red Rockets (6:30)",
    "2025-02-18": "Blue Blazers vs Ivory Irons (5:00)",
    "2025-02-22": "Golden Griffins vs Onyx Owls (7:30)",
    "2025-02-26": "Bronze Bears vs Silver Sharks (6:30)",
    "2025-02-28": "Crimson Coyotes vs Blue Blazers (7:00)",

    // March 2025
    "2025-03-01": "Golden Griffins vs Ivory Irons (6:00)",
    "2025-03-05": "Onyx Owls vs Blue Blazers (5:30)",
    "2025-03-08": "Thunderbolts vs Red Rockets (7:00)",
    "2025-03-11": "Ivory Irons vs Bronze Bears (6:30)",
    "2025-03-15": "Crimson Coyotes vs Amber Arrows (7:30)",
    "2025-03-18": "Magenta Marauders vs Blue Blazers (5:00)",
    "2025-03-22": "Amber Arrows vs Golden Griffins (6:00)",
  };

  // **Dummy reschedule slots for February & March**
  const rescheduleSlots = {
    "2025-02-02": [],
    "2025-02-03": ["9:30 PM | Field 1", "9:30 PM | Field 3"],
    "2025-02-05": ["5:00 PM | Field 1", "9:30 PM | Field 3"],
    "2025-02-07": ["6:30 PM | Field 1", "8:00 PM | Field 3"],
    "2025-02-10": ["5:30 PM | Field 1", "9:30 PM | Field 3"],
    "2025-02-14": ["6:30 PM | Field 1", "8:00 PM | Field 3"],
    "2025-02-18": [],
    "2025-02-22": ["6:00 PM | Field 2", "8:00 PM | Field 4"],
    "2025-02-26": ["5:30 PM | Field 1", "7:30 PM | Field 3"],
    "2025-02-28": ["8:00 PM | Field 3"],

    "2025-03-01": ["5:30 PM | Field 1"],
    "2025-03-05": ["6:30 PM | Field 1", "8:30 PM | Field 3"],
    "2025-03-08": ["7:00 PM | Field 2"],
    "2025-03-11": ["6:30 PM | Field 1"],
    "2025-03-15": ["5:30 PM | Field 1", "9:00 PM | Field 3"],
  };

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <div style={styles.header}>
        <button style={styles.navButton} onClick={() => handleNavigation("prev")}>Prev</button>
        <h2 style={styles.title}>{weekRange}</h2>
        <button style={styles.navButton} onClick={() => handleNavigation("next")}>Next</button>
      </div>

      {/* Weekly Schedule Grid */}
      <div style={styles.calendar}>
        {weekDates.map((date, index) => (
          <div key={index} style={styles.calendarCard}>
            <h4 style={styles.calendarDay}>{date.day}</h4>
            <p style={styles.calendarDate}>{date.date}</p>
            <p style={styles.eventText}>{matchData[date.fullDate] || "No Matches"}</p>
          </div>
        ))}
      </div>

      {/* Reschedule Request Section */}
      <div style={styles.rescheduleSection}>
        <h3 style={styles.rescheduleTitle}>Reschedule Request</h3>
        <p style={styles.subtitle}>Choose an available timeslot</p>
        <div style={styles.rescheduleGrid}>
          {weekDates.map((date, index) => (
            <div key={index} style={styles.rescheduleCard}>
              <h4 style={styles.rescheduleDay}>{date.day}</h4>
              <p style={styles.rescheduleDate}>{date.date}</p>
              {rescheduleSlots[date.fullDate]?.length > 0 ? (
                rescheduleSlots[date.fullDate].map((slot, slotIndex) => (
                  <button key={slotIndex} style={styles.slotButton}>{slot}</button>
                ))
              ) : (
                <p style={styles.noTimeslotsText}>No timeslots available</p>
              )}
            </div>
          ))}
        </div>
        <button style={styles.submitButton}>Submit</button>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "'Segoe UI', sans-serif", color: "#7A003C" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "24px", fontWeight: "bold", textAlign: "center" },
  navButton: { backgroundColor: "#7A003C", color: "white", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer" },
  calendar: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "15px", marginBottom: "20px" },
  calendarCard: { border: "1px solid #D3D3D3", borderRadius: "5px", padding: "10px", backgroundColor: "#F5F5F5", textAlign: "center" },
  calendarDay: { fontWeight: "bold", color: "#7A003C" },
  calendarDate: { fontSize: "14px", color: "#4F4F4F", fontWeight: "bold" },
  eventText: { fontSize: "12px", color: "#7A003C", fontWeight: "bold" },
  rescheduleSection: { marginTop: "30px" },
  rescheduleTitle: { fontSize: "20px", fontWeight: "bold", marginBottom: "10px" },
  subtitle: { fontSize: "16px", marginBottom: "20px" },
  rescheduleGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "15px" },
  rescheduleCard: { border: "1px solid #D3D3D3", borderRadius: "5px", padding: "10px", backgroundColor: "#FFFFFF", textAlign: "center" },
  rescheduleDay: { fontWeight: "bold", color: "#7A003C" },
  rescheduleDate: { fontSize: "14px", color: "#4F4F4F", fontWeight: "bold" },
  slotButton: { backgroundColor: "#FFFFFF", border: "1px solid #7A003C", borderRadius: "5px", padding: "5px 10px", color: "#7A003C", fontWeight: "bold", margin: "5px 0", cursor: "pointer" },
  noTimeslotsText: { fontSize: "14px", color: "#4F4F4F" },
  submitButton: { display: "block", margin: "20px auto", backgroundColor: "#7A003C", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" },
};