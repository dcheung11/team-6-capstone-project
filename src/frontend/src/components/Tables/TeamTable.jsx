// Author: Damien Cheung
// Description: This component displays a table of teams with options to change division, payment status, and delete teams.
// Last Modified: 2025-03-12

import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Modal,
  Box,
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// TeamTable: Displays a table of teams with options to change division, payment status, and delete teams.
export default function TeamTable(props) {
  const [open, setOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  // Function to handle division change
  const handleDivisionChange = (teamId, newDivisionId) => {
    const updatedTeams = props.tempTeams.map((team) => {
      if (team.id === teamId) {
        return { ...team, divisionId: newDivisionId };
      }
      return team;
    });
    props.setTempTeams(updatedTeams);
  };

  // Function to handle payment status toggle
  const handlePaymentToggle = (name) => {
    console.log(`Changing paid for team ${name}`);
    setOpen(false);
  };
  
  // Function to handle modal close
  const handleClose = () => {
    setOpen(false);
  };
  
  // Function to handle delete team action
  const handleDeleteTeam = () => {
    props.handleDeleteTeam(teamToDelete);
    setOpen(false);
    setTeamToDelete(null);
  };

  // Function to handle icon click (delete action)
  const handleIconClick = (name) => {
    setTeamToDelete(name);
    setOpen(true);
  };

  // Function to get division name by ID
  function getDivisionName(divisionId) {
    const division = props.divisions.find(
      (division) => division.id === divisionId
    );
    return division ? division.name : "null"; // Default fallback, change later
  }

  // Function to get preferred division for a team
  function getPreferredDivision(refTeam) {
    const team = props.registeredTeams.find((team) => team.id === refTeam.id);
    return team && team.divisionId ? team.divisionId : null;
  }

  // Define columns for the table
  const columns = [
    { label: "Team Name", accessor: (team) => team.name },
    {
      label: "Captain",
      accessor: (team) =>
        `${team.captainId.firstName} ${team.captainId.lastName}`,
    },
    { label: "Captain Email", accessor: (team) => team.captainId.email },
    { label: "Roster Size", accessor: (team) => team.roster.length },

    { label: "Preferred Times", accessor: (team) => team.preferredTimes },
    {
      label: "Blacklist Days",
      accessor: (team) => (team.blacklistDays ? team.blacklistDays : "None"),
    },
    {
      label: "Preferred Division",
      accessor: (team) => getDivisionName(getPreferredDivision(team)),
    },
  ];

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "40vh", mb: 2 }}>
        <Table stickyHeader aria-label="team management table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index}>{col.label}</TableCell>
              ))}
              <TableCell>Division</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(props.tempTeams || []).map((team) => (
              <TableRow key={team.id}>
                {columns.map((col, index) => (
                  <TableCell key={index}>{col.accessor(team)}</TableCell>
                ))}
                <TableCell>
                  <Select
                    defaultValue={team.divisionId}
                    value={team.divisionId}
                    label={getDivisionName(team.divisionId)}
                    onChange={(e) =>
                      handleDivisionChange(team.id, e.target.value)
                    }
                    size="small"
                  >
                    {props.divisions.map((division) => (
                      <MenuItem key={division.id} value={division.id}>
                        {division.name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={team.paid}
                        onChange={() => handlePaymentToggle(team.name)}
                        name={`paid-${team.id}`}
                        size="small"
                      />
                    }
                    label="Paid"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleIconClick(team.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this team? This action cannot be
            undone.
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteTeam}
            >
              Yes
            </Button>
            <Button variant="contained" onClick={handleClose}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
