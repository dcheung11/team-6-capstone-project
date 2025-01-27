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

export default function StandingsTable(props) {
  const standingColumns = ["Rank", "Team", "PTS", "W", "D", "L", "RS", "RA"];
  const standingKeys = ["rank", "team", "p", "w", "d", "l", "rs", "ra"];
  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            {standingColumns.map((column) => (
              <TableCell>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.standings.map((standingRow) => (
            <TableRow key={standingRow.rank}>
              {standingKeys.map((key) => (
                <TableCell>{standingRow[key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
