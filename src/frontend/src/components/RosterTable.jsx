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
    <TableContainer component={Paper} sx={{ mb: 6 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.players.map((player, index) => (
            <TableRow key={index}>
              {props.players.captain === player.name ? (
                <TableCell>{player.name} (Captain) </TableCell>
              ) : (
                <TableCell>{player.name}</TableCell>
              )}
              <TableCell>{player.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
