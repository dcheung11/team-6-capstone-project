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
  const [editMode, setEditMode] = useState({}); // track edit mode (per game)

  useEffect(() => {
    if (props.schedule && props.schedule.games) {
      const newScores = {};
      const newDefaults = {};
      const newEditMode = {};

      props.schedule.games.forEach((game) => {
        newScores[game._id] = { 
          home: game.homeScore, 
          away: game.awayScore, 
          submitted: !!game.submitted, // if no value etc., sets to false. otherwise keeps bool vals the same
        }; 
      
      if (game.defaultLossTeam) {
        newDefaults[game._id] = {
          isDefaultLoss: true,
          team: game.defaultLossTeam.toString(), // store the team id as a string
        };
      } else {
        newDefaults[game._id] = {
          isDefaultLoss: false,
          team: null,
        };
      }

      newEditMode[game._id] = !game.submitted; // set edit mode (when editing scores AKA not submitted)
      });

      setScores(newScores);
      setDefaultLossOptions(newDefaults);
      setEditMode(newEditMode);
    }
  }, [props.schedule]);

  // toggle "edit mode" when user can edit the scores of a game
  const toggleEditMode = (gameId) => {
    setEditMode((prev) => ({
      ...prev, 
      [gameId]: !prev[gameId],
    }));
  };

  const handleSubmitScore = async (gameId, homeScore, awayScore, defaultLossTeam) => {
    console.log(`Submit score for game with ID: ${gameId}`);
    console.log(homeScore, awayScore);
    try {
      console.log(`defaultLossTeam value: ${defaultLossTeam}`);
      const result = await updateScore(gameId, homeScore, awayScore, defaultLossTeam);
      console.log("Score updated successfully:", result);

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

      // Once submitted, read-only unless user hits "Edit Score"
      setEditMode((prev) => ({
        ...prev,
        [gameId]: false,
      }));
    } catch (error) {
      console.error("Error submitting score:", error);
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
        const { isDefaultLoss = false, team = null } = defaultLossOptions[gameId] || {};
        const isEditting = editMode[gameId];

        return (
          <Checkbox
            checked={isDefaultLoss}
            disabled={!isEditting}
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
              if (!checked) { // If user unchecked, reset to blank
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
        const isEditting = editMode[gameId];

        // Convert stored ID to "home"/"away" for UI
        const selectedTeamId = defaultLossOptions[gameId]?.team;
        let radioVal = "";
        if (selectedTeamId === game.homeTeam._id) radioVal = "home";
        if (selectedTeamId === game.awayTeam._id) radioVal = "away";

        // Only enable if default loss is checked
        return (
          <FormControl component="fieldset" disabled={!isEditting || !isDefaultLoss}>
            <RadioGroup
              row
              value={radioVal} 
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
        const gameId = game._id;
        const isEditting = editMode[gameId];
        const homeScore = scores[gameId]?.home ?? game.homeScore ?? "";
        const isDefaultLoss = defaultLossOptions[gameId]?.isDefaultLoss || false;    
        
        // If user is not a captain/commissioner or if game is archived, just show the score as text
        if ((!isCaptain && props.role !== "commissioner") || props.archived) {
          return homeScore || "-";
        }
        
        return (
          <TextField
            value={homeScore || ""}
            onChange={(e) => handleScoreChange(gameId, "home", e.target.value)}
            size="small"
            variant="outlined"
            type="number"
            inputProps={{
              maxLength: 2,
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
              max: 99,
              style: { color: 'inherit' },
            }}
            sx={{ 
              width: "60px",
              "& .Mui-disabled": {
                WebkitTextFillColor: 'inherit',
                color: 'inherit',
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: 'inherit',
                color: 'inherit',
              }
            }}
            disabled={!isEditting || isDefaultLoss}
          />
        );
      },
    },
    {
      header: "Away Score",
      accessor: (game) => {
        const gameId = game._id;
        const isEditting = editMode[gameId];
        const awayScore = scores[gameId]?.away ?? game.awayScore ?? "";
        const isDefaultLoss = defaultLossOptions[gameId]?.isDefaultLoss || false;

        // If user is not a captain/commissioner or if game is archived, just show the score as text
        if ((!isCaptain && props.role !== "commissioner") || props.archived) {
          return awayScore || "-";
        }

        return (
          <TextField
            value={awayScore || ""}
            onChange={(e) => handleScoreChange(gameId, "away", e.target.value)}
            size="small"
            variant="outlined"
            type="number"
            inputProps={{
              maxLength: 2,
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
              max: 99,
              style: { color: 'inherit' },
            }}
            sx={{ 
              width: "60px",
              "& .Mui-disabled": {
                WebkitTextFillColor: 'inherit',
                color: 'inherit',
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: 'inherit',
                color: 'inherit',
              }
            }}
            disabled={!isEditting || isDefaultLoss}
          />
        );
      },
    },
    {
      header: "Action",
      accessor: (game) => {
        const gameId = game._id;
        const isEditting = editMode[gameId];
        const buttonLabel = isEditting ? "Submit Score" : "Edit Score";

        // Evaluate if the button is disabled
        const getIsDisabled = () => {
          if (!isCaptain && props.role !== "commissioner") {
            return true; // no permission at all
          }
          if (!isEditting) {
            // If not editing, let them click to "Edit Score" (unless no permission)
            return false;
          }
          // if in edit mode, check for valid inputs
          const home = scores[gameId]?.home;
          const away = scores[gameId]?.away;
          const isDefaultLoss = defaultLossOptions[gameId]?.isDefaultLoss || false;
          const defaultLossTeamId = defaultLossOptions[gameId]?.team;

          if (isDefaultLoss) {
            // must pick a team
            if (!defaultLossTeamId) return true;
          } else {
            // must enter home & away
            if (home === "" || home == null || away === "" || away == null) return true;
            // optional: also check if it's a valid number >= 0
            if (isNaN(home) || isNaN(away) || Number(home) < 0 || Number(away) < 0) return true;
          }
          return false;
        };

        const handleButtonClick = () => {
          if (isEditting) {
            // Submitting
            const home = scores[gameId]?.home;
            const away = scores[gameId]?.away;
            const defaultLossTeam = defaultLossOptions[gameId]?.isDefaultLoss
              ? defaultLossOptions[gameId]?.team
              : null;
            handleSubmitScore(gameId, home, away, defaultLossTeam);
          } else {
            // Switch to edit mode
            toggleEditMode(gameId);
          }
        };       

        return (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7A003C",
              color: "white",
              "&:hover": { backgroundColor: "#5A002C" },
            }}
            size="small"
            onClick={handleButtonClick}
            disabled={getIsDisabled()}
          >
            {buttonLabel}
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
