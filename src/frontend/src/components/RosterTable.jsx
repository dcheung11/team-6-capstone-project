import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function RosterTable(props) {
  return (
    <TableContainer component={Paper} sx={{ mb: 2, maxHeight: "50vh" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.roster.map((player, index) => (
            <TableRow key={index}>
              {props.captain.id === player.id ? (
                <TableCell>
                  {player.firstName} {player.lastName} (Captain){" "}
                </TableCell>
              ) : (
                <TableCell>
                  {player.firstName} {player.lastName}
                </TableCell>
              )}
              <TableCell>{player.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
