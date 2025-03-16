import React, { useState, useEffect } from "react";
import { createRescheduleRequest } from "../api/reschedule-requests";

// Utility functions
function getLocalISODate(date) {
  date.setHours(12, 0, 0, 0);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

const getPopupWeekDates = (date) => {
  let monday = new Date(date);
  const day = monday.getDay();
  if (day === 0) {
    // If Sunday, jump to Monday
    monday.setDate(monday.getDate() + 1);
  } else {
    // Otherwise, back up to Monday
    monday.setDate(monday.getDate() - (day - 1));
  }
  // Return 5 days (Monday to Friday)
  return [...Array(5)].map((_, i) => {
    let dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const fullDate = getLocalISODate(dayDate);
    return {
      day: dayDate.toLocaleDateString("en-US", { weekday: "long" }),
      date: dayDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      fullDate,
    };
  });
};

function getPopupWeekRange(date) {
  let startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  let endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startStr = startOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const endStr = endOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `${startStr} - ${endStr}`;
}

export const ReschedulePopup = ({ selectedDate, selectedMatch, availableTimeslots, player, onClose }) => {
  const [popupDate, setPopupDate] = useState(new Date(selectedDate));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeslotData = availableTimeslots || [];
  const currentPlayer = player;
  const oppTeam = selectedMatch.homeTeam._id === currentPlayer?.team?._id ? selectedMatch.awayTeam : selectedMatch.homeTeam;

  const popupWeekDates = getPopupWeekDates(popupDate);
  const popupWeekRange = getPopupWeekRange(popupDate);
  const [newSlots, setNewSlots] = useState([]);


  // Fetch available slots from backend

  const handleWeekNav = (direction) => {
    let newDate = new Date(popupDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setPopupDate(newDate);
  };

  const handleSubmit = async () => {
    // create reschedule request
    await createRescheduleRequest({
      gameId: selectedMatch._id,
      requestingTeamId: currentPlayer.team._id,
      recipientTeamId: oppTeam._id,
      requestedGameslotIds: newSlots
    });

    alert(`Reschedule request sent to ${oppTeam?.name}`);
    onClose();
  };

  const handleSelectSlot = (slotId) => {
    // add new slot to state if not already selected, else remove it
    if (newSlots.includes(slotId)) {
      setNewSlots(newSlots.filter((id) => id !== slotId));
      return;
    }

    setNewSlots([...newSlots, slotId]);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Reschedule Slots</h3>
        <p style={styles.selectedMatch}>Game: vs {oppTeam.name}</p>
        <p style={styles.selectedDate}>Original Date: {selectedDate}, {selectedMatch.time}, {selectedMatch.field}</p>

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
          {popupWeekDates.map((dayObj, i) => {
            const slots = timeslotData[dayObj.fullDate] || [];
            // console.log(timeslotData);
            // NOTE: I think need to clear db of old gameslots bc some are on weekends

            return (
              <div key={i} style={styles.dayCard}>
                <h4 style={styles.dayTitle}>{dayObj.day} {dayObj.date}</h4>
                  {slots.length > 0 ? (
                    slots.map((slot, idx) => (
                      <button key={idx} style={{
                        ...styles.slotButton,
                        backgroundColor: newSlots.includes(slot.id) ? "#7A003C" : "white",
                        color: newSlots.includes(slot.id) ? "white" : "#7A003C",
                      }} onClick={() => handleSelectSlot(slot.id)}>
                        {slot.slotString}
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
    maxWidth: "1000px",
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