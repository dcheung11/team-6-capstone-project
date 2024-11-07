import React, { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import teamsData from "../data/teams.json";

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Track the current month

  // Using map() to extract all the team names
  const teamNames = teamsData.map((team) => team.name);
  let matches = [];

  // Loop through the teamNames array in steps of 2
  for (let i = 0; i < teamNames.length - 1; i += 2) {
    // Use `i` and `i+1` to pair up teams
    matches.push(`${teamNames[i]} vs ${teamNames[i + 1]}`);
  }

  // Get the start and end of the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);

  // Get the range of dates to display for the calendar
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dates = [];
  let day = startDate;
  while (day <= endDate) {
    dates.push(day);
    day = addDays(day, 1);
  }

  // Function to go to the next month
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Function to go to the previous month
  const goToPrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header with Navigation Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Center the content
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        {/* Previous Month Button */}
        <Button
          onClick={goToPrevMonth}
          variant="contained"
          color="primary"
          sx={{
            marginRight: 2,
            backgroundColor: "#7A003C", // Main color
            "&:hover": { backgroundColor: "#7A003C" },
          }}
        >
          Prev
        </Button>
        {/* Month Year Display */}
        <Typography variant="h4" align="center" sx={{ color: "#495965", fontWeight: "bold" }}>
          {format(monthStart, "MMMM yyyy")}
        </Typography>
        {/* Next Month Button */}
        <Button
          onClick={goToNextMonth}
          variant="contained"
          color="primary"
          sx={{
            marginLeft: 2,
            backgroundColor: "#7A003C", // Main color
            "&:hover": { backgroundColor: "#7A003C" },
          }}
        >
          Next
        </Button>
      </Box>
      <TableContainer
        sx={{
          maxWidth: "1000px", // Set a max width for the table container
          margin: "auto", // Center the table
          overflowX: "auto", // Enable horizontal scrolling if needed
          backgroundColor: "#F5F5F5", // Light background for the table
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
                    backgroundColor: "#7A003C", // Main color
                    color: "white",
                    fontWeight: "bold",
                    border: "3px solid #7A003C", // Use main color for border
                    padding: "8px", // Reduce padding for better mobile fit
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
                  // Keep track of which match to display
                  const matchIndex = weekIndex * 7 + dayIndex; // Calculate the current match index
                  return (
                    <TableCell
                      key={dayIndex}
                      align="center"
                      sx={{
                        width: "100px", // Default fixed width
                        height: "100px", // Default fixed height
                        border: "3px solid #7A003C", // Use main color for border
                        backgroundColor: isSameMonth(date, monthStart) ? "white" : "#E0E0E0", // Light gray for non-month dates
                        color: isSameDay(date, new Date()) ? "#FDBF57" : "#495965", // Highlight today's date with secondary color
                        fontWeight: isSameDay(date, new Date()) ? "bold" : "normal",
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#FDBF57", // Hover effect with secondary color
                          color: "white",
                        },
                        padding: "4px", // Reduced padding for mobile
                        fontSize: "0.75rem", // Reduce font size for better fit
                        "@media (max-width: 600px)": {
                          width: "15vw", // Adjust width for smaller screens
                          height: "15vw", // Adjust height for smaller screens
                          fontSize: "0.7rem", // Reduce font size further
                        },
                      }}
                    >
                      {/* Display the match only if the matchIndex is within the bounds of matches */}
                      {matchIndex < matches.length ? (
                        <>
                          <Typography variant="body2">{format(date, "d")}</Typography>
                          <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                            {matches[matchIndex]}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2">{format(date, "d")}</Typography>
                      )}
                    </TableCell>
                  );
                })}
                {/* Add empty cells if the last row is less than 7 days */}
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
