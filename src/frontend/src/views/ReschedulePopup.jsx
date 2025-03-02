import React, { useState, useEffect } from "react";

// Utility functions
function getLocalISODate(date) {
  // console.log("date: ", date);
  date.setHours(12, 0, 0, 0);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  // console.log("localDate: ", localDate);
  return localDate.toISOString().split("T")[0];
}

function getPopupWeekDates(currentDate) {
  let startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
  return [...Array(7)].map((_, i) => {
    let dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    return {
      day: dayDate.toLocaleDateString("en-US", { weekday: "long" }),
      date: dayDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      fullDate: getLocalISODate(dayDate),
    };
  });
}

function getPopupWeekRange(date) {
  let startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  let endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startStr = startOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const endStr = endOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `${startStr} - ${endStr}`;
}

export const ReschedulePopup = ({ selectedDate, selectedMatch, availableTimeslots, onClose }) => {
  console.log("selectedDate: ", selectedDate);
  console.log("selectedMatch: ", selectedMatch);
  const [popupDate, setPopupDate] = useState(new Date(selectedDate));
  console.log("popupDate: ", popupDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeslotData = availableTimeslots || [];

  const popupWeekDates = getPopupWeekDates(popupDate);
  const popupWeekRange = getPopupWeekRange(popupDate);


  // Fetch available slots from backend

  const handleWeekNav = (direction) => {
    let newDate = new Date(popupDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    console.log("handleWeekNav is running");
    setPopupDate(newDate);
  };

  const handleSubmit = () => {
    alert(`Rescheduled: ${selectedMatch} on ${selectedDate}`);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Reschedule Slots</h3>
        {/* TODO: game slots never available on mondays for some reason */}
        <p style={styles.selectedMatch}>Game: vs {selectedMatch.awayTeam.name}</p>
        <p style={styles.selectedDate}>Original Date: {selectedDate}</p>

        {/* Week Navigation */}
        <div style={styles.weekNav}>
          <button style={styles.navButton} onClick={() => handleWeekNav("prev")}>Prev</button>
          <span style={styles.navText}>{popupWeekRange}</span>
          <button style={styles.navButton} onClick={() => handleWeekNav("next")}>Next</button>
        </div>

        {/* Loading/Error */}
        {loading && <p>Loading available slots...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Timeslot Grid */}
        <div style={styles.timeslotGrid}>
          {/* {console.log("popupWeekDates: ", popupWeekDates)} */}
          {popupWeekDates.map((dayObj, i) => {
            const slots = timeslotData[dayObj.fullDate] || []; // get timeslot.date === dayObj.fullDate from each date in popup
            // console.log("timeslotData: ", timeslotData);
            // console.log("slots for this day: ", dayObj.fullDate," : ", slots);
            return (
              <div key={i} style={styles.dayCard}>
                <h4 style={styles.dayTitle}>{dayObj.day} {dayObj.date}</h4>
                  {slots.length > 0 ? (
                    slots.map((slot, idx) => (
                      <button key={idx} style={styles.slotButton}>
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p style={styles.noTimeslotsText}>No timeslots available</p>
                  )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.closeButton} onClick={onClose}>Close</button>
          <button style={styles.submitButton} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ReschedulePopup;

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "10px",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "800px",
    padding: "20px",
    textAlign: "center",
    boxSizing: "border-box",
    overflow: "auto",
    maxHeight: "90vh",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#7A003C",
    marginBottom: "10px",
  },
  selectedMatch: {
    fontWeight: "bold",
    color: "#7A003C",
    marginBottom: "5px",
    fontSize: "16px",
  },
  selectedDate: {
    color: "#4F4F4F",
    marginBottom: "15px",
    fontSize: "14px",
  },
  weekNav: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap",
    gap: "10px",
  },
  navButton: {
    backgroundColor: "#7A003C",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  navText: {
    fontWeight: "bold",
    color: "#7A003C",
    fontSize: "16px",
  },
  timeslotGrid: {
    display: "flex",
    flexWrap: "wrap",     // Wrap columns on smaller screens
    gap: "10px",
    justifyContent: "center",
    marginBottom: "15px",
  },
  dayCard: {
    border: "1px solid #D3D3D3",
    borderRadius: "5px",
    backgroundColor: "#F5F5F5",
    textAlign: "center",
    minWidth: "110px",
    padding: "10px",
    margin: "5px",
  },
  dayTitle: {
    fontWeight: "bold",
    color: "#7A003C",
    marginBottom: "5px",
    fontSize: "14px",
  },
  slotButton: {
    display: "block",
    backgroundColor: "white",
    border: "1px solid #7A003C",
    borderRadius: "5px",
    padding: "5px",
    color: "#7A003C",
    fontWeight: "bold",
    marginBottom: "5px",
    cursor: "pointer",
  },
  noTimeslotsText: {
    fontSize: "12px",
    color: "#4F4F4F",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  closeButton: {
    backgroundColor: "#4F4F4F",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#7A003C",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};