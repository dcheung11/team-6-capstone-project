// Author: Emma Wigglesworth
// Description: This component displays a standings table for the current season.
// Last Modified: 2025-03-18

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
import { MCMASTER_COLOURS } from "../../utils/Constants.js";


export default function StandingsTable({ standings }) {
  const standingColumns = ["Rank", "Team", "PTS", "W", "D", "L", "RS", "RA", "Run Diff", "Losses by Default"];//, "No Show Shame"];
  const standingKeys = ["rank", "team", "p", "w", "d", "l", "rs", "ra", "differential", "dl"];//, "noshows"];

  return (
    // Standings table styling - AI generated
    <TableContainer 
      component={Paper} 
      sx={{ 
        mb: 4,
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        '& .MuiTableCell-root': {
          px: 2,
          py: 1.5,
          borderColor: 'rgba(0,0,0,0.1)',
        },
        '& .MuiTableCell-head': {
          backgroundColor: MCMASTER_COLOURS.maroon,
          color: 'white',
          fontWeight: 600,
        },
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {standingColumns.map((column, index) => (
              <TableCell key={index} align={index > 1 ? "center" : "left"}>
                <strong>{column}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map((standingRow, rowIndex) => (
            <TableRow 
              key={rowIndex}
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                },
                '&:last-child td, &:last-child th': { 
                  borderBottom: 0 
                },
              }}
            >
              {standingKeys.map((key, colIndex) => (
                <TableCell 
                  key={colIndex} 
                  align={colIndex > 1 ? "center" : "left"}
                  sx={{
                    ...(key === "team" && {
                      fontWeight: 500,
                    })
                  }}
                >
                  {key === "team"
                    ? standingRow.team?.name || "Unknown"
                    : key === "differential"
                    ? standingRow.differential > 0
                      ? `+${standingRow.differential}`
                      : standingRow.differential
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
