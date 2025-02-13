import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { formatDate } from "../utils/Formatting";
import { updateScore } from "../api/game.js";

export default function ScheduleTable(props) {
  const handleSubmitScore = async (gameId, score1, score2) => {
    console.log(`Submit score for game with ID: ${gameId}`);
    console.log(score1, score2)
    try {
      const result = await updateScore(gameId, score1, score2);
      console.log("Score updated successfully:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Define columns
  const columns = [
    {
      header: "Date",
      accessor: (game) => formatDate(game.date),
    },
    { header: "Time", accessor: (game) => game.time },
    { header: "Field", accessor: (game) => game.field },
    { header: "Division", accessor: (game) => game.division.name },
    { header: "Team 1", accessor: (game) => game.team1.name },
    { header: "Team 2", accessor: (game) => game.team2.name },
    {
      header: "Score",
      accessor: (game) => {
        if (game.score1 === 0 && game.score2 === 0) {
          return (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#7A003C", color: "white", "&:hover": { backgroundColor: "#5A002C" } }}
              size="small"
              onClick={() => handleSubmitScore(game._id)}
            >
              Submit Score
            </Button>
          );
        } else if (game.score1 !== undefined && game.score2 !== undefined) {
          return `${game.score1} - ${game.score2}`;
        } else {
          return "";
        }
      },
    },
  ];

  return props.schedule ? (
    <TableContainer component={Paper} sx={{ mb: 2, maxHeight: "50vh" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {/* Map over columns for headers */}
            {columns.map((column, index) => (
              <TableCell key={index}>{column.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through the games */}
          {props.schedule.games && props.schedule.games.length > 0 ? (
            props.schedule.games.map((game, index) => (
              <TableRow key={index}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} sx={{ height: 12 }}>
                    {column.accessor(game)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No games scheduled.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <>No Schedule Table to Display</>
  );
}
