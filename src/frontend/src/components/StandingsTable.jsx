import React from "react";
import {
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Table,
  TableCell,
  TableBody,
} from "@mui/material";

export default function StandingsTable({ standings }) {
  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>PTS</TableCell>
            <TableCell>W</TableCell>
            <TableCell>D</TableCell>
            <TableCell>L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map((standing, index) => (
            <TableRow key={index}>
              <TableCell>{standing.rank}</TableCell>
              <TableCell>{standing.team?.teamName || "Unknown"}</TableCell>
              <TableCell>{standing.wins * 2 + standing.draws}</TableCell>
              <TableCell>{standing.wins}</TableCell>
              <TableCell>{standing.draws}</TableCell>
              <TableCell>{standing.losses}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
