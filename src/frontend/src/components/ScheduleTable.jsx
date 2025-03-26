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
  Box,
} from "@mui/material";
import { formatDate, getDayOfWeek } from "../utils/Formatting";
import { updateScore } from "../api/game.js";

// McMaster colors
const MCMASTER_COLORS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

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
      header: "Game Info",
      accessor: (game) => (
        <Box>
          <Typography variant="subtitle2" sx={{ color: MCMASTER_COLORS.maroon, fontWeight: 600 }}>
            {getDayOfWeek(game.date)}
          </Typography>
          <Typography variant="body2" sx={{ color: MCMASTER_COLORS.grey }}>
            {formatDate(game.date)}
          </Typography>
          <Typography variant="body2" sx={{ color: MCMASTER_COLORS.grey }}>
            {game.time} | {game.field}
          </Typography>
        </Box>
      ),
    },
    {
      header: "Teams",
      accessor: (game) => (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography 
              component="span" 
              variant="caption" 
              sx={{ 
                color: MCMASTER_COLORS.maroon,
                fontWeight: 600,
                backgroundColor: `${MCMASTER_COLORS.maroon}10`,
                px: 0.5,
                borderRadius: 0.5
              }}
            >
              HOME
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {game.homeTeam.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Typography 
              component="span" 
              variant="caption" 
              sx={{ 
                color: MCMASTER_COLORS.grey,
                fontWeight: 600,
                backgroundColor: `${MCMASTER_COLORS.grey}10`,
                px: 0.5,
                borderRadius: 0.5
              }}
            >
              AWAY
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {game.awayTeam.name}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: MCMASTER_COLORS.grey, display: 'block', mt: 0.5 }}>
            Division {game.division.name}
          </Typography>
        </Box>
      ),
    },
    {
      header: "Default Loss",
      accessor: (game) => {
        const gameId = game._id;
        const { isDefaultLoss = false, team = null } = defaultLossOptions[gameId] || {};
        const isEditting = editMode[gameId];

        return isEditting ? (
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDefaultLoss}
                  disabled={!isEditting}
                  size="small"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setDefaultLossOptions((prev) => ({
                      ...prev,
                      [gameId]: {
                        ...prev[gameId],
                        isDefaultLoss: checked,
                        team: checked ? prev[gameId]?.team || null : null,
                      },
                    }));
                    if (!checked) {
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
              }
              label="Default Loss"
            />
            {isDefaultLoss && (
              <FormControl component="fieldset" size="small">
                <RadioGroup
                  row
                  value={team === game.homeTeam._id ? "home" : team === game.awayTeam._id ? "away" : ""}
                  onChange={(e) => {
                    const teamVal = e.target.value;
                    const teamId = teamVal === "home" ? game.homeTeam._id : game.awayTeam._id;

                    setDefaultLossOptions((prev) => ({
                      ...prev,
                      [gameId]: {
                        ...prev[gameId],
                        team: teamId,
                      },
                    }));

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
                  <FormControlLabel value="home" control={<Radio size="small" />} label="Home" />
                  <FormControlLabel value="away" control={<Radio size="small" />} label="Away" />
                </RadioGroup>
              </FormControl>
            )}
          </Box>
        ) : isDefaultLoss ? (
          <Typography variant="body2" sx={{ color: 'error.main' }}>
            {team === game.homeTeam._id ? game.homeTeam.name : game.awayTeam.name} (Default Loss)
          </Typography>
        ) : null;
      },
      shouldShow:
        isCaptain || (props.role === "commissioner" && !props.archived),
    },
    {
      header: "Score",
      accessor: (game) => {
        const gameId = game._id;
        const isEditting = editMode[gameId];
        const homeScore = scores[gameId]?.home ?? game.homeScore ?? "";
        const awayScore = scores[gameId]?.away ?? game.awayScore ?? "";
        const isDefaultLoss = defaultLossOptions[gameId]?.isDefaultLoss || false;

        if ((!isCaptain && props.role !== "commissioner") || props.archived) {
          return (
            <Typography variant="body2">
              {homeScore || "-"} - {awayScore || "-"}
            </Typography>
          );
        }

        return isEditting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              disabled={isDefaultLoss}
            />
            <Typography variant="body1">-</Typography>
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
              disabled={isDefaultLoss}
            />
          </Box>
        ) : (
          <Typography variant="body2">
            {homeScore || "-"} - {awayScore || "-"}
          </Typography>
        );
      },
    },
    {
      header: "Action",
      accessor: (game) => {
        const gameId = game._id;
        const isEditting = editMode[gameId];
        const buttonLabel = isEditting ? "Submit" : "Edit";
        const wasSubmitted = scores[gameId]?.submitted;

        const handleCancel = () => {
          // Reset scores to original values
          setScores((prevScores) => ({
            ...prevScores,
            [gameId]: {
              home: game.homeScore,
              away: game.awayScore,
              submitted: true
            }
          }));
          // Reset default loss options
          setDefaultLossOptions((prev) => ({
            ...prev,
            [gameId]: {
              isDefaultLoss: game.defaultLossTeam ? true : false,
              team: game.defaultLossTeam ? game.defaultLossTeam.toString() : null
            }
          }));
          // Exit edit mode
          toggleEditMode(gameId);
        };

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

        return isEditting ? (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {wasSubmitted && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleCancel}
                sx={{
                  borderColor: MCMASTER_COLORS.grey,
                  color: MCMASTER_COLORS.grey,
                  minWidth: '80px',
                  '&:hover': {
                    borderColor: MCMASTER_COLORS.grey,
                    backgroundColor: `${MCMASTER_COLORS.grey}10`,
                  },
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="contained"
              size="small"
              onClick={handleButtonClick}
              disabled={getIsDisabled()}
              sx={{
                backgroundColor: MCMASTER_COLORS.maroon,
                minWidth: '80px',
                '&:hover': {
                  backgroundColor: '#5C002E',
                },
                '&.Mui-disabled': {
                  backgroundColor: `${MCMASTER_COLORS.grey}80`,
                }
              }}
            >
              {buttonLabel}
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={handleButtonClick}
            disabled={getIsDisabled()}
            sx={{
              backgroundColor: MCMASTER_COLORS.maroon,
              minWidth: '80px',
              '&:hover': {
                backgroundColor: '#5C002E',
              },
              '&.Mui-disabled': {
                backgroundColor: `${MCMASTER_COLORS.grey}80`,
              }
            }}
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
    <TableContainer 
      component={Paper} 
      sx={{ 
        mb: 2,
        maxHeight: "60vh",
        '& .MuiTableCell-root': {
          px: 2,
          py: 1.5,
        },
        '& .MuiTableCell-head': {
          backgroundColor: MCMASTER_COLORS.maroon,
          color: 'white',
          fontWeight: 600,
        },
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {/* Map over columns for headers */}
            {visibleColumns.map((column, index) => (
              <TableCell 
                key={index}
                align={column.header === "Action" ? "center" : "left"}
                sx={{
                  whiteSpace: 'nowrap',
                }}
              >
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through the games */}
          {props.schedule.games && props.schedule.games.length > 0 ? (
            props.schedule.games.map((game, index) => (
              <TableRow 
                key={index}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: `${MCMASTER_COLORS.maroon}05`,
                  },
                  '&:hover': {
                    backgroundColor: `${MCMASTER_COLORS.maroon}0A`,
                  },
                }}
              >
                {visibleColumns.map((column, colIndex) => (
                  <TableCell 
                    key={colIndex}
                    align={column.header === "Action" ? "center" : "left"}
                  >
                    {column.accessor(game)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length} align="center">
                <Typography sx={{ py: 2, color: MCMASTER_COLORS.grey }}>
                  No games scheduled.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Typography variant="h6" sx={{ mb: 2, color: MCMASTER_COLORS.grey }}>
      No Schedule Available: email the commissioner if this is an unexpected error.
    </Typography>
  );
}
