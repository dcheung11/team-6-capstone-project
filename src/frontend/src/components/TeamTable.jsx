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

export default function TeamTable(props) {
  const [open, setOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);

  const handleDivisionChange = (teamId, newDivisionId) => {
    console.log(`Changing division for team ${teamId} to ${newDivisionId}`);
    const updatedTeams = props.tempTeams.map((team) => {
      if (team.id === teamId) {
        return { ...team, division: newDivisionId };
      }
      return team;
    });
    props.setTempTeams(updatedTeams);
  };

  const handlePaymentToggle = (name) => {
    console.log(`Changing paid for team ${name}`);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteTeam = () => {
    props.handleDeleteTeam(teamToDelete);
    setOpen(false);
    setTeamToDelete(null);
  };

  const handleIconClick = (name) => {
    setTeamToDelete(name);
    setOpen(true);
  };

  function getDivisionName(divisionId) {
    const division = props.divisions.find(
      (division) => division.id === divisionId
    );
    return division ? division.name : "null"; // Default fallback, change later
  }

  function getPreferredDivision(refTeam) {
    const team = props.registeredTeams.find((team) => team.id === refTeam.id);
    return team && team.division ? team.division : null;
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "40vh", mb: 2 }}>
        <Table stickyHeader aria-label="team management table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Team Name</TableCell>
              <TableCell>Captain</TableCell>
              <TableCell>Captain Email</TableCell>
              <TableCell>Roster Size</TableCell>
              <TableCell>Preferred Division</TableCell>
              <TableCell>Division</TableCell>
              <TableCell>Preferred Times</TableCell>
              <TableCell>Blacklist Days</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(props.tempTeams || []).map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.captain}</TableCell>
                <TableCell>{team.captain}@email.com</TableCell>
                <TableCell>{team.roster.length}</TableCell>
                <TableCell>
                  {getDivisionName(getPreferredDivision(team))}
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={team.division}
                    value={team.division}
                    label={getDivisionName(team.division)}
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
                <TableCell>{team.preferredTimes}</TableCell>
                <TableCell>{team.blacklistDays}</TableCell>
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
                    onClick={() => handleIconClick(team.name)}
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
