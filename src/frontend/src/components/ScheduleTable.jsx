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
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { formatDate, getDayOfWeek } from "../utils/Formatting";
import { updateScore } from "../api/game.js";

export default function ScheduleTable(props) {
  const [scores, setScores] = useState({});
  const [defaultLossOptions, setDefaultLossOptions] = useState({});
  const isCaptain = props.captain === props.player;
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

  const handleSubmitScore = async (gameId, homeScore, awayScore, defaultLossTeam) => {
    console.log(`Submit score for game with ID: ${gameId}`);
    console.log(homeScore, awayScore);
    try {
      console.log(`defaultLossTeam value: ${defaultLossTeam}`);
      const result = await updateScore(gameId, homeScore, awayScore, defaultLossTeam);

      // Update the local state to reflect the 'submitted' status
      setScores((prevScores) => ({
        ...prevScores,
        [gameId]: {
          ...prevScores[gameId],
          home: homeScore,
          away: awayScore,
          defaultLossTeam: defaultLossTeam,
          submitted: true, // Set the 'submitted' field to true only when the score is submitted
        },
      }));

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
      header: "Default Loss?",
      accessor: (game) => {
        const gameId = game._id;
        const isDefaultLoss = defaultLossOptions[gameId]?.isDefaultLoss || false;

        return (
          <Checkbox
            checked={isDefaultLoss}
            onChange={(e) => {
              const checked = e.target.checked;
              setDefaultLossOptions((prev) => ({
                ...prev,
                [gameId]: {
                  ...prev[gameId],
                  isDefaultLoss: checked,
                  // If turning on default loss, pick whichever team you want or none
                  team: checked ? prev[gameId]?.team || null : null,
                },
              }));

              // // If turning it on, also set default scores
              // if (checked) {
              //   // Suppose away lost by default: away=1, home=9
              //   setScores((prevScores) => ({
              //     ...prevScores,
              //     [gameId]: {
              //       ...prevScores[gameId],
              //       home: 9,
              //       away: 1,
              //     },
              //   }));
              // } else {
              if (!checked) {
                // If user unchecked, reset to blank
                setScores((prevScores) => ({
                  ...prevScores,
                  [gameId]: {
                    ...prevScores[gameId],
                    home: "",
                    away: "",
                  },
                }));
              }
            }}
          />
        );
      },
      shouldShow:
        isCaptain || (props.role === "commissioner" && !props.archived),
    },
    {
      header: "Lost By?",
      accessor: (game) => {
        const gameId = game._id;
        const isDefaultLoss = defaultLossOptions[gameId]?.isDefaultLoss || false;
        const selectedTeam = defaultLossOptions[gameId]?.team || null;

        // Only enable if default loss is checked
        return (
          <FormControl component="fieldset" disabled={!isDefaultLoss}>
            <RadioGroup
              row
              value={
                defaultLossOptions[gameId]?.team === game.homeTeam._id
                  ? "home"
                  : defaultLossOptions[gameId]?.team === game.awayTeam._id
                  ? "away"
                  : ""
              } // Convert team ID back to "home" or "away"
              onChange={(e) => {
                const teamVal = e.target.value; // "home" or "away"
                const teamId = teamVal === "home" ? game.homeTeam._id : game.awayTeam._id; // Store actual ID

                setDefaultLossOptions((prev) => ({
                  ...prev,
                  [gameId]: {
                    ...prev[gameId],
                    team: teamId,
                  },
                }));

                // Set default scores based on who lost
                setScores((prevScores) => ({
                  ...prevScores,
                  [gameId]: {
                    ...prevScores[gameId],
                    home: teamVal === "home" ? 1 : 9,
                    away: teamVal === "away" ? 1 : 9,
                  },
                }));
              }}
            >
              <FormControlLabel value="home" control={<Radio />} label="Home" />
              <FormControlLabel value="away" control={<Radio />} label="Away" />
            </RadioGroup>
          </FormControl>
        );
      },
      shouldShow:
        isCaptain || (props.role === "commissioner" && !props.archived),
    },
    {
      header: "Home Score",
      accessor: (game) => {
        if (!isCaptain & (props.role !== "commissioner") || props.archived) {
          return scores[game._id]?.home || game.homeScore;
        }
        const homeScore = scores[game._id]?.home || game.homeScore;
        const isDisabled = scores[game._id]?.submitted || game.submitted; // Check if submitted
        const isDefaultLoss = defaultLossOptions[game._id]?.isDefaultLoss || false;
        return (
          <TextField
            value={homeScore || ""}
            onChange={(e) =>
              handleScoreChange(game._id, "home", e.target.value)
            }
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
            disabled={isDisabled || isDefaultLoss} // Disable if the score is submitted or default loss was checked
          />
        );
      },
    },
    {
      header: "Away Score",
      accessor: (game) => {
        if (!isCaptain & (props.role !== "commissioner") || props.archived) {
          return scores[game._id]?.away || game.awayScore;
        }
        const awayScore = scores[game._id]?.away || game.awayScore;
        const isDisabled = scores[game._id]?.submitted || game.submitted;
        const isDefaultLoss =
          defaultLossOptions[game._id]?.isDefaultLoss || false;
        return (
          <TextField
            value={awayScore || ""}
            onChange={(e) =>
              handleScoreChange(game._id, "away", e.target.value)
            }
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
            disabled={isDisabled || isDefaultLoss} // Disable if the score is submitted
          />
        );
      },
    },
    {
      header: "Action",
      accessor: (game) => {
        const isDefaultLoss =
          defaultLossOptions[game._id]?.isDefaultLoss || false;
        const defaultLossTeam = defaultLossOptions[game._id]?.isDefaultLoss
          ? defaultLossOptions[game._id]?.team
          : null;
        const isSubmitDisabled =
          props.captain != props.player ||
          game.submitted ||
          scores[game._id]?.submitted ||
          scores[game._id]?.home === null ||
          scores[game._id]?.away === null ||
          scores[game._id]?.home === "" ||
          scores[game._id]?.away === "" ||
          (isDefaultLoss && !defaultLossTeam);
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
              handleSubmitScore(
                game._id,
                scores[game._id]?.home,
                scores[game._id]?.away,
                defaultLossTeam
              )
            }
            disabled={isSubmitDisabled} // Disable the button if homeScore or awayScore is null
          >
            Submit Score
          </Button>
        );
      },
      shouldShow:
        isCaptain || (props.role === "commissioner" && !props.archived),
    },
  ];

  // Filter columns based on role or captain status
  const visibleColumns = columns.filter(
    (column) => column.shouldShow === undefined || column.shouldShow
  );

  return props.schedule ? (
    <TableContainer component={Paper} sx={{ mb: 2, maxHeight: "50vh" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {/* Map over columns for headers */}
            {visibleColumns.map((column, index) => (
              <TableCell key={index}>{column.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through the games */}
          {props.schedule.games && props.schedule.games.length > 0 ? (
            props.schedule.games.map((game, index) => (
              <TableRow key={index}>
                {visibleColumns.map((column, colIndex) => (
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
    <Typography variant="h6" sx={{ mb: 2 }}>
      No Schedule Available: email the commissioner if this is an unexpected error.
    </Typography>
  );
}
