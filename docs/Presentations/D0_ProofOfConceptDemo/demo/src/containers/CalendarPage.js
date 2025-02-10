import React, { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import gameSchedule from "../data/gameSchedule.json";

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Organize gameSchedule data by date for quick lookup
  const gamesByDate = {};
  for (const week in gameSchedule) {
    gameSchedule[week].forEach((game) => {
      const date = game.date; // e.g., "2025-04-28"
      if (!gamesByDate[date]) {
        gamesByDate[date] = [];
      }
      gamesByDate[date].push(game);
    });
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dates = [];
  let day = startDate;
  while (day <= endDate) {
    dates.push(day);
    day = addDays(day, 1);
  }

  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 2 }}>
        <Button onClick={goToPrevMonth} variant="contained" color="primary" sx={{ marginRight: 2, backgroundColor: "#7A003C", "&:hover": { backgroundColor: "#7A003C" } }}>
          Prev
        </Button>
        <Typography variant="h4" align="center" sx={{ color: "#495965", fontWeight: "bold" }}>
          {format(monthStart, "MMMM yyyy")}
        </Typography>
        <Button onClick={goToNextMonth} variant="contained" color="primary" sx={{ marginLeft: 2, backgroundColor: "#7A003C", "&:hover": { backgroundColor: "#7A003C" } }}>
          Next
        </Button>
      </Box>
      <TableContainer
        sx={{
          maxWidth: "1000px",
          margin: "auto",
          overflowX: "auto",
          backgroundColor: "#F5F5F5",
        }}
      >
        <Table sx={{ width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <TableCell
                  key={day}
                  align="center"
                  sx={{
                    backgroundColor: "#7A003C",
                    color: "white",
                    fontWeight: "bold",
                    border: "3px solid #7A003C",
                    padding: "8px",
                  }}
                >
                  <Typography variant="subtitle1">{day}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: Math.ceil(dates.length / 7) }).map((_, weekIndex) => (
              <TableRow key={weekIndex}>
                {dates.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => {
                  const dateStr = format(date, "yyyy-MM-dd"); // Format date to match JSON format
                  const gamesForDate = gamesByDate[dateStr] || []; // Get games scheduled for this date

                  return (
                    <TableCell
                      key={dayIndex}
                      align="center"
                      sx={{
                        width: "100px",
                        height: "100px",
                        border: "3px solid #7A003C",
                        backgroundColor: isSameMonth(date, monthStart) ? "white" : "#E0E0E0",
                        color: isSameDay(date, new Date()) ? "#FDBF57" : "#495965",
                        fontWeight: isSameDay(date, new Date()) ? "bold" : "normal",
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#FDBF57",
                          color: "white",
                        },
                        padding: "4px",
                        fontSize: "0.75rem",
                        "@media (max-width: 600px)": {
                          width: "15vw",
                          height: "15vw",
                          fontSize: "0.7rem",
                        },
                      }}
                    >
                      <Typography variant="body2">{format(date, "d")}</Typography>
                      {gamesForDate.map((game, gameIndex) => (
                        <Typography key={gameIndex} variant="body2" sx={{ fontSize: "0.75rem" }}>
                          {game.teams[0]} vs {game.teams[1]} ({game.time})
                        </Typography>
                      ))}
                    </TableCell>
                  );
                })}
                {Array.from({ length: 7 - dates.slice(weekIndex * 7, (weekIndex + 1) * 7).length }).map((_, emptyIndex) => (
                  <TableCell key={emptyIndex} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CalendarPage;
