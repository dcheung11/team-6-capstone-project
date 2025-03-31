import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { getPlayerById } from "../../api/player";
import { getOngoingSeasons, getUpcomingSeasons } from "../../api/season";
import { formatDate } from "../../utils/Formatting";
import { Typography, Container, Box, Tab, Stack, Button, Collapse, IconButton } from "@mui/material";
import { getAvailableGameslots, swapSlots } from "../../api/reschedule-requests";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LoadingOverlay from '../../components/LoadingOverlay';
import { MCMASTER_COLOURS } from "../../utils/Constants.js";

// CommissionerSchedule: Displays a calendar view for the commissioner to swap game slots.
export const CommissionerSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const [player, setPlayer] = useState(null);
  const [seasonGames, setSeasonGames] = useState([]);
  const [availableGameslots, setAvailableGameslots] = useState({});
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});

  // Fetch player info
    useEffect(() => {
        const fetchPlayer = async () => {
        try {
            setLoading(true);
            const data = await getPlayerById(auth.playerId);
            setPlayer(data.player);
        } catch (err) {
            setError(err.message || "Failed to fetch player");
        } finally {
            setLoading(false);
        }
        };
        fetchPlayer();
    }, [auth.playerId]);

    const fetchSeasonGames = async () => {
      try {
        setLoading(true);
        let seasonData = await getOngoingSeasons();
        // console.log("seasonData", seasonData.seasons[0].schedule.games);
        if (!seasonData) {
          seasonData = await getUpcomingSeasons();
        }
        if (!seasonData) {
          throw new Error("No ongoing or upcoming seasons found");
        }
        else if (!seasonData.seasons[0]?.schedule) {
          setSeasonGames([]);
        }
        else {
          setSeasonGames(seasonData.seasons[0].schedule.games);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch season schedule");
      } finally {
        setLoading(false);
      }
    };

    // Fetch season schedule (all games) using player's team seasonId
    useEffect(() => {
      fetchSeasonGames();
    }, [player]);

    // Fetch season schedule (all gameslots)
    useEffect(() => {
      fetchGameslots();
    }, []);

    const fetchGameslots = async () => {
      setLoading(true);
      setError(null);
      try {
        // this gets the available gameslots in this year
        const response = await getAvailableGameslots();

        // Transform data into { "YYYY-MM-DD": ["Time | Field"] } format
        const formattedData = response.reduce((acc, slot) => {
          const dateKey = formatDate(new Date(slot.date));
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

  // Navigation: change month
  const handleNavigation = (direction) => {
    setLoading(true);
    let newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newDate);
    setLoading(false);
  };

  // Display month and year
  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Generate calendar cells for the current month using local ISO dates
  const getMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startOffset = firstDay.getDay();
    
    const dates = [];
    // Add null for empty spaces at start of month
    for (let i = 0; i < startOffset; i++) {
      dates.push(null);
    }
    
    // Add actual dates
    for (let day = 1; day <= daysInMonth; day++) {
      // Create a new Date object for each day
      dates.push(new Date(year, month, day));
    }

    // Fill in remaining days to complete the grid (optional)
    const totalDays = 42; // 6 rows × 7 days
    while (dates.length < totalDays) {
      dates.push(null);
    }
    
    return dates;
  };

  const monthDates = getMonthDates();

  // Handle slot selection, limit to two slots
  const handleSelect = (slot) => {
    if (slot1 && slot1.id === slot.id) {
      setSlot1(null);
    } else if (slot2 && slot2.id === slot.id) {
      setSlot2(null);
    } else if (slot1 === null) {
      setSlot1(slot);
    } else if (slot2 === null) {
      setSlot2(slot);
    } else {
      alert("Please deselect one of the selected slots first.");
    }
  }

  // Handle swap submission and ensure two slots are selected
  const handleSubmit = async () => {
    if (!slot1 || !slot2) {
      console.error("Must select two slots/games");
      alert("Must select two slots/games")
      return
    }
    setLoading(true);
    try {
      await swapSlots(slot1.id, slot2.id);
      await fetchSeasonGames();
      await fetchGameslots();
    } catch (err) {
      console.error("Failed to swap slots:", err);
      alert("Failed to swap slots");
      setError(err.message);
    } finally {
      setSlot1(null);
      setSlot2(null);
      setLoading(false);
    }
  }

  // For each day, filter all season games (normalized) that match this day
  const getMatchesForDay = (dayISO) => {
    if (!dayISO) return null;
    const matches = seasonGames.filter(
      (game) => formatDate(new Date(game.date)) === formatDate(new Date(dayISO))
    );
    if (matches.length === 0) return null;
    
    return matches.map((match, idx) => (
      <Button
        key={idx}
        className={(slot1 && slot1.id === match._id) || (slot2 && slot2.id === match._id) ? 'selected' : ''}
        onClick={() => handleSelect({ id: match._id, ...match })}
        fullWidth
      >
        <Box sx={{ width: '100%', textAlign: 'left' }}>
          <Typography sx={styles.sectionLabel}>
            {match.awayTeam.name} @ {match.homeTeam.name}
          </Typography>
          <Typography sx={styles.sectionLabel}>
            {match.time} | {match.field}
          </Typography>
        </Box>
      </Button>
    ));
  };

  const getSlotsForDay = (dayISO) => {
    if (!dayISO) return null;
    const slots = availableGameslots[formatDate(dayISO)] || [];
    if (slots.length === 0) return null;

    return slots.map((slot, idx) => (
      <Button
        key={idx}
        className={(slot1 && slot1.id === slot.id) || (slot2 && slot2.id === slot.id) ? 'selected' : ''}
        onClick={() => handleSelect(slot)}
        fullWidth
      >
        <Box sx={{ width: '100%', textAlign: 'left' }}>
          <Typography sx={styles.sectionLabel}>
            {slot.slotString}
          </Typography>
        </Box>
      </Button>
    ));
  };

  const handleDayToggle = (dayISO) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayISO]: !prev[dayISO]
    }));
  };

  const getDayContent = (dayISO) => {
    if (!dayISO) return null;
    
    const matches = getMatchesForDay(dayISO);
    const slots = getSlotsForDay(dayISO);
    const hasContent = (matches || slots);
    
    return (
      <Box sx={styles.dayContent}>
        <Typography sx={styles.dayNumber}>
          {new Date(dayISO).getUTCDate()}
        </Typography>
        
        {hasContent && (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDayToggle(dayISO);
            }}
            endIcon={expandedDays[dayISO] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            sx={styles.toggleButton}
          >
            {expandedDays[dayISO] ? 'Hide slots' : 'View slots'}
            {(matches || slots) ? ` (${(matches?.length || 0) + (slots?.length || 0)})` : ''}
          </Button>
        )}
        
        <Collapse in={expandedDays[dayISO]} timeout="auto">
          <Box sx={styles.contentBox}>
            {matches && (
              <>
                <Typography sx={styles.sectionLabel}>
                  Games:
                </Typography>
                {matches}
              </>
            )}
            {slots && (
              <>
                <Typography sx={styles.sectionLabel}>
                  Available Slots:
                </Typography>
                {slots}
              </>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ px: 0 }}>
      <Box sx={styles.containerBox}>
        {/* Navigation Header */}
        <Box sx={styles.navigationHeader}>
          <Button
            onClick={() => handleNavigation('prev')}
            sx={styles.navigationButton}
          >
            Previous
          </Button>
          <Typography sx={styles.monthYearText}>
            {monthYear}
          </Typography>
          <Button
            onClick={() => handleNavigation('next')}
            sx={styles.navigationButton}
          >
            Next
          </Button>
        </Box>

        {/* Calendar Container */}
        <Box sx={styles.calendarContainer}>
          {/* Calendar Grid */}
          <Box sx={styles.calendarGrid}>
            {/* Week Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Box key={day} sx={styles.weekDayHeader}>
                {day}
              </Box>
            ))}

            {/* Calendar Days */}
            {monthDates.map((date, index) => (
              <Box key={index} sx={styles.calendarDay}>
                {date instanceof Date && getDayContent(date.toISOString())}
              </Box>
            ))}
          </Box>

          {/* Loading Overlay */}
          {loading && (
            <Box sx={loadingOverlayStyle}>
              <LoadingOverlay loading={loading} message="Loading games..." />
            </Box>
          )}
        </Box>

        {/* Buttons Container */}
        <Box sx={styles.buttonContainer}>
          <Button
            onClick={() => {
              setSlot1(null);
              setSlot2(null);
            }}
            sx={styles.submitButton}
          >
            Clear Selection
          </Button>
          <Button
            onClick={() => handleSubmit()}
            sx={styles.submitButton}
          >
            Submit Swap
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CommissionerSchedule;

const loadingOverlayStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '20px',
  borderRadius: '8px',
  zIndex: 1000,
};

const styles = {
  containerBox: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    py: 2
  },
  navigationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3
  },
  navigationButton: {
    backgroundColor: MCMASTER_COLOURS.maroon,
    color: 'white',
    padding: '8px 24px',
    borderRadius: '6px',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.maroon + 'E6',
    }
  },
  monthYearText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: MCMASTER_COLOURS.maroon,
    textAlign: 'center'
  },
  calendarContainer: {
    position: 'relative',
    minHeight: '600px',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    backgroundColor: MCMASTER_COLOURS.lightGrey,
    borderRadius: '8px',
    overflow: 'hidden'
  },
  weekDayHeader: {
    padding: '10px',
    textAlign: 'center',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: MCMASTER_COLOURS.grey
  },
  calendarDay: {
    minHeight: '120px',
    padding: '8px',
    backgroundColor: 'white',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.lightGrey + '20'
    }
  },
  dayContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  dayNumber: {
    fontWeight: 500,
    fontSize: '14px',
    color: MCMASTER_COLOURS.maroon,
    mb: 1
  },
  toggleButton: {
    color: MCMASTER_COLOURS.maroon,
    fontSize: '12px',
    padding: '4px 8px',
    textTransform: 'none',
    borderRadius: '6px',
    backgroundColor: MCMASTER_COLOURS.lightGrey + '40',
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.lightGrey + '80',
    },
    mb: 1
  },
  contentBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '200px',
    overflowY: 'auto',
    px: 0.5,
    py: 1,
    '& .MuiButton-root': {
      fontSize: '12px',
      padding: '8px',
      borderRadius: '6px',
      backgroundColor: MCMASTER_COLOURS.lightGrey + '40',
      border: 'none',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: MCMASTER_COLOURS.lightGrey + '80',
        transform: 'translateY(-2px)',
        boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
      },
      '&.selected': {
        backgroundColor: MCMASTER_COLOURS.maroon,
        '& .MuiTypography-root': {
          color: 'white !important',
        },
        '&:hover': {
          backgroundColor: MCMASTER_COLOURS.maroon + 'E6',
        }
      }
    }
  },
  sectionLabel: {
    fontSize: '11px',
    color: MCMASTER_COLOURS.grey,
    fontWeight: 500,
    mb: 1
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 2
  },
  submitButton: {
    backgroundColor: MCMASTER_COLOURS.maroon,
    color: 'white',
    padding: '8px 24px',
    borderRadius: '6px',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.maroon + 'E6',
    }
  }
};