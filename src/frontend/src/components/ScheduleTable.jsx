import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
} from "@mui/material";
import { formatDate, getDayOfWeek } from "../utils/Formatting";
import { updateScore } from "../api/game.js";

export default function ScheduleTable(props) {
  const [scores, setScores] = useState({});

  // Update scores when the component is mounted or when props.schedule changes
  useEffect(() => {
    if (props.schedule && props.schedule.games) {
      const newScores = props.schedule.games.reduce((acc, game) => {
        acc[game._id] = { home: game.homeScore, away: game.awayScore };
        return acc;
      }, {});
      setScores(newScores);
    }
  }, [props.schedule]);
  
  const handleSubmitScore = async (gameId, homeScore, awayScore) => {
    console.log(`Submit score for game with ID: ${gameId}`);
    console.log(homeScore, awayScore);
    try {
      const result = await updateScore(gameId, homeScore, awayScore);

       // Update the local state to reflect the 'submitted' status
       setScores((prevScores) => ({
        ...prevScores,
        [gameId]: {
          ...prevScores[gameId],
          home: homeScore,
          away: awayScore,
          submitted: true, // Set the 'submitted' field to true only when the score is submitted
        },
      }));

      console.log("Score updated successfully:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleScoreChange = (gameId, team, value) => {
    setScores((prevScores) => ({
      ...prevScores,
      [gameId]: {
        ...prevScores[gameId],
        [team]: value,
      },
    }));
    console.log(scores)
  };

  // Define columns
  const columns = [
    {
      header: "Day of Week",
      accessor: (game) => getDayOfWeek(game.date),
    },
    {
      header: "Date",
      accessor: (game) => formatDate(game.date),
    },
    { header: "Time", accessor: (game) => game.time },
    { header: "Field", accessor: (game) => game.field },
    { header: "Division", accessor: (game) => game.division.name },
    { header: "Home", accessor: (game) => game.homeTeam.name },
    { header: "Away", accessor: (game) => game.awayTeam.name },
    {
      header: "Home Score",
      accessor: (game) => {
        const homeScore = scores[game._id]?.home || game.homeScore;
        const isDisabled = scores[game._id]?.submitted || game.submitted; // Check if submitted
        return (
          <TextField
            value={homeScore || ""}
            onChange={(e) => handleScoreChange(game._id, "home", e.target.value)}
            size="small"
            variant="outlined"
            type="number"
            inputProps={{
              maxLength: 2,
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
              max: 99,
            }}
            sx={{ width: "60px" }} // Set the width for compact appearance
            disabled={isDisabled} // Disable if the score is submitted
          />
        );
      },
    },
    {
      header: "Away Score",
      accessor: (game) => {
        const awayScore = scores[game._id]?.away || game.awayScore;
        const isDisabled = scores[game._id]?.submitted || game.submitted;
        return (
          <TextField
            value={awayScore || ""}
            onChange={(e) => handleScoreChange(game._id, "away", e.target.value)}
            size="small"
            variant="outlined"
            type="number"
            inputProps={{
              maxLength: 2,
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
              max: 99,
            }}
            sx={{ width: "60px" }} // Set the width for compact appearance
            disabled={isDisabled} // Disable if the score is submitted
          />
        );
      },
    },
    {
      header: "Action",
      accessor: (game) => {
        const isSubmitDisabled =
          props.captain != props.player ||
          game.submitted || scores[game._id]?.submitted || scores[game._id]?.home === null || scores[game._id]?.away === null || scores[game._id]?.home === '' ||
          scores[game._id]?.away === '';
        return (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7A003C",
              color: "white",
              "&:hover": { backgroundColor: "#5A002C" },
            }}
            size="small"
            onClick={() =>
              handleSubmitScore(game._id, scores[game._id]?.home, scores[game._id]?.away)
            }
            disabled={isSubmitDisabled} // Disable the button if homeScore or awayScore is null
          >
            Submit Score
          </Button>
        );
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
