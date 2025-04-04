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
  const standingColumns = ["Rank", "Team", "PTS", "W", "D", "L", "RS", "RA", "Run Diff"];//, "No Show Shame"];
  const standingKeys = ["rank", "team", "p", "w", "d", "l", "rs", "ra", "differential"];//, "noshows"];

  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            {standingColumns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map((standingRow, rowIndex) => (
            <TableRow key={rowIndex}>
              {standingKeys.map((key, colIndex) => (
                <TableCell key={colIndex}>
                  {key === "team"
                    ? standingRow.team?.name || "Unknown" // handle missing team names
                    : key === "differential"
                    ? standingRow.differential > 0
                      ? `+${standingRow.differential}` // add "+" for positive values
                      : standingRow.differential // show as is for negative/zero
                    : standingRow[key] ?? "N/A"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
