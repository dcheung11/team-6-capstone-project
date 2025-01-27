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
} from "@mui/material";

export default function TeamTable(props) {
  const [teams, setTeams] = useState(props.teams);

  const handleDivisionChange = (name, newDivision) => {
    console.log(`Changing division for team ${name} to ${newDivision}`);

    setTeams(
      teams.map((team) =>
        team.name === name ? { ...team, division: newDivision } : team
      )
    );
  };

  const handlePaymentToggle = (name) => {
    console.log(`Changing paid for team ${name}`);

    setTeams(
      teams.map((team) =>
        team.name === name ? { ...team, paid: !team.paid } : team
      )
    );
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "40vh", mb: 2 }}>
      <Table stickyHeader aria-label="team management table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Team Name</TableCell>
            <TableCell>Captain</TableCell>
            <TableCell>Division</TableCell>
            <TableCell>Payment Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell>{team.name}</TableCell>
              <TableCell>{team.captain}</TableCell>
              <TableCell>
                <Select
                  defaultValue={team.division}
                  value={team.division}
                  onChange={(e) =>
                    handleDivisionChange(team.name, e.target.value)
                  }
                  size="small"
                  sx={{ mt: 0, mb: 0, padding: 0, height: 24 }}
                >
                  {props.divisions.map((division) => (
                    <MenuItem key={division.id} value={division.name}>
                      {division.name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <FormControlLabel
                  sx={{ mt: 0, mb: 0, padding: 0, height: 20 }}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
