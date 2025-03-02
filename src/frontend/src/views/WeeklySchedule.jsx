import React, { useState, useEffect } from "react";
import ReschedulePopup from "./ReschedulePopup";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { getScheduleGamesByTeamId } from "../api/team";
import { getAvailableGameslots } from "../api/reschedule-requests";

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
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
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
        // console.log('this ran: ', player);
        return;
      }
      
      // console.log('that ran', player.team);
      try {
        setLoading(true);
        const data = await getScheduleGamesByTeamId(player.team.id);
        // console.log("data: ", data);
        const weekDates = getWeekDates(currentDate);
        // console.log("weekDates: ", weekDates);

        const filteredGames = data.games.filter(game => {
          let gameDate = new Date(game.date);
          gameDate = getLocalISODate(gameDate);
          // console.log("gamedate: ", gameDate);
          return gameDate >= weekDates[0].fullDate && gameDate <= weekDates[6].fullDate
        });

        // data.games.forEach(game => {
        //   let gameDate = new Date(game.date);
        //   gameDate = getLocalISODate(gameDate);
        //   console.log("gamedate: ", gameDate);
        //   console.log('first day of current week  weekDates[0].fullDate: ', weekDates[0].fullDate );
        //   console.log("gameDate >= weekDates[0] ? ", gameDate >= weekDates[0].fullDate);
        //   console.log("gameDate <= weekDates[6] ? ", gameDate <= weekDates[6].fullDate);

        //   if (gameDate >= weekDates[0].fullDate && gameDate <= weekDates[6].fullDate) {
        //     console.log("hi");
        //   }
        // });


        console.log("filteredGames", filteredGames);
        setTeamGames(filteredGames);
        console.log("team games in effect: ", teamGames);
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
      console.log("this is running");
      try {
        const response = await getAvailableGameslots();
        console.log("available gameslot response: ", response.slice(0,5));
        // if (!response.ok) throw new Error("Failed to fetch timeslots.");
        // const data = await response.json();

        console.log("available gameslot data: ", response.length);

        // Transform data into { "YYYY-MM-DD": ["Time | Field"] } format
        const formattedData = response.reduce((acc, slot) => {
          const dateKey = getLocalISODate(new Date(slot.date));
          const slotString = `${slot.time} | ${slot.field}`;
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(slotString);
          return acc;
        }, {});

        console.log("formattedData: ", formattedData);
        setAvailableGameslots(formattedData);
        // console.log("availableGameslots in effect: ", availableGameslots);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameslots();
  }, []);

  const handleNavigation = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
    // console.log('new date has time? ', newDate);
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
        {weekDates.map((wdate, index) => {
          // Find the game that matches this week date
          const match = teamGames.find(game => {
            const gameDate = new Date(game.date);
            const gameFullDate = getLocalISODate(gameDate);
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
                    {new Date(match.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <button
                    style={styles.rescheduleButton}
                    onClick={() => handleRescheduleClick(wdate.fullDate, match)}
                  >
                    Reschedule
                  </button>
                </>
              ) : (
                <p style={styles.eventText}>No Matches</p>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        Object.keys(availableGameslots).length > 0 ? (
          // Show popup ONLY when data exists
          <ReschedulePopup
            selectedDate={selectedDate}
            selectedMatch={selectedMatch}
            availableTimeslots={availableGameslots}
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

      {/* Reschedule Modal
      {console.log("availableGameslots: ", availableGameslots.length)}
      {showModal && (
        <ReschedulePopup
          selectedDate={selectedDate}
          selectedMatch={selectedMatch}
          availableTimeslots ={availableGameslots}
          onClose={() => setShowModal(false)}
        />
      )} */}
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
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker overlay for contrast
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    color: "#FFC72C", // Gold text
    fontSize: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    flexDirection: "column", // Stack spinner and text
    gap: "15px",
  },
};
