import React, { useState, useEffect } from "react";
import ReschedulePopup from "./ReschedulePopup";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { getScheduleGamesByTeamId } from "../api/team";
import { getAvailableGameslots } from "../api/reschedule-requests";
import { formatDate } from "../utils/Formatting";

// Fix the "day ahead" issue by normalizing date/time
function getLocalISODate(date) {
  date.setHours(12, 0, 0, 0);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

export const WeeklySchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  const [teamGames, setTeamGames] = useState([]);
  const [availableGameslots, setAvailableGameslots] = useState({});

  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        setLoading(true);
        const data = await getPlayerById(pid);
        setPlayer(data.player);
      } catch (err) {
        setError(err.message || "Failed to fetch player");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById(playerId);
  }, []);

  useEffect(() => {
    const fetchTeamGames = async () => {
      if (!player?.team?.id) {
        return;
      }

      try {
        setLoading(true);
        const data = await getScheduleGamesByTeamId(player.team.id);
        const weekDates = getWeekDates(currentDate);

        const filteredGames = data.games.filter(game => {
          let gameDate = formatDate(game.date);
          return gameDate >= weekDates[0].fullDate && gameDate <= weekDates[6].fullDate
        });

        setTeamGames(filteredGames);
      } catch (err) {
        setError(err.message || "Failed to fetch team schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamGames();
  }, [player, currentDate]);

  useEffect(() => {
    const fetchGameslots = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAvailableGameslots();

        // Transform data into { "YYYY-MM-DD": ["Time | Field"] } format
        const formattedData = response.reduce((acc, slot) => {
          const dateKey = getLocalISODate(new Date(slot.date));
          const slotString = `${slot.time} | ${slot.field}`;
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push({ id: slot._id, slotString: slotString });
          return acc;
        }, {});

        setAvailableGameslots(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameslots();
  }, []);

  const handleNavigation = (direction) => {
    setLoading(true);
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
        <h2 style={styles.title}>
          {loading ? "Loading..." : getWeekRange(currentDate)}
        </h2>
        <button style={styles.navButton} onClick={() => handleNavigation("next")}>
          Next
        </button>
      </div>

      {/* loading overlay */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <p>Loading games...</p>
        </div>
      )}

      {/* Weekly Schedule Grid */}
      {!loading &&
        <div style={styles.calendar}>
          {weekDates.map((wdate, index) => {
            // Find the game that matches this week date
            const match = teamGames.find(game => {
              // const gameFullDate = formatDate(game.date);
              const gameFullDate = getLocalISODate(new Date(game.date));
              return gameFullDate === wdate.fullDate;
            });

            return (
              <div key={index} style={styles.calendarCard}>
                <h4 style={styles.calendarDay}>{wdate.day}</h4>
                <p style={styles.calendarDate}>{wdate.date}</p>
                
                {match ? (
                  <>
                    <p style={styles.eventText}>
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </p>
                    <p style={styles.gameTime}>
                      {match.time}
                    </p>
                    <p style={styles.gameField}>
                      {match.field}
                    </p>
                    {/* TODO: captainId is populated so this syntax is a bit gross */}
                    {player.team.captainId.id === player._id ? (<button
                      style={styles.rescheduleButton}
                      onClick={() => handleRescheduleClick(wdate.fullDate, match)}
                    >
                      Reschedule
                    </button>) : null}
                  </>
                ) : (
                  <p style={styles.eventText}>No Matches</p>
                )}
              </div>
            );
          })}
        </div>
      }

      {showModal && (
        Object.keys(availableGameslots).length > 0 ? (
          // Show popup ONLY when data exists
          <ReschedulePopup
            selectedDate={selectedDate}
            selectedMatch={selectedMatch}
            availableTimeslots={availableGameslots}
            player={player}
            onClose={() => setShowModal(false)}
          />
        ) : (
          // Show loading ONLY while data is empty
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner}></div>
            <p>Loading available timeslots...</p>
          </div>
        )
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
    fontSize: "14px",
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
  loadingOverlay: {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  fontWeight: "bold",
  color: "#7A003C",
  display: "flex",          // Added for centering
  flexDirection: "column",  // Stack spinner & text
  alignItems: "center",     // Center horizontally
  justifyContent: "center", // Center vertically
  gap: "10px",              // Space between spinner & text
},
  spinner: { width: "30px", height: "30px", border: "4px solid #FFC72C", borderTop: "4px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" },
};
