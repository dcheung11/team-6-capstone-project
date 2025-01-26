import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function ScheduleTable(props) {
  return (
    <TableContainer component={Paper} sx={{ mb: 6 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Opposing Team</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.games.map((game, index) => (
            <TableRow key={index}>
              <TableCell>{game.date}</TableCell>
              <TableCell>{game.team}</TableCell>
              <TableCell>{game.result}</TableCell>
              <TableCell>{game.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
