// Author: Damien Cheung
// Description: This component displays a table of players in a team with their contact information.
// Last Modified: 2025-02-28

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
import { MCMASTER_COLOURS } from "../../utils/Constants";

// RosterTable: Displays a table of players in a team with their contact information.
export default function RosterTable(props) {
  return (
    // Styling for the roster table - AI assisted
    <TableContainer 
      component={Paper}
      sx={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '8px',
        mb: 2,
        maxHeight: "50vh",
        '& .MuiTableCell-root': {
          px: 2,
          py: 1.5,
        },
        '& .MuiTableCell-head': {
          backgroundColor: MCMASTER_COLOURS.maroon,
          color: 'white',
          fontWeight: 600,
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '40%' }}>Player</TableCell>
            <TableCell sx={{ width: '30%' }}>Email</TableCell>
            <TableCell sx={{ width: '30%' }}>Phone Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Styling for the table rows - AI generated */}
          {props.roster.map((player, index) => (
            <TableRow 
              key={index}
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                },
              }}
            >
              <TableCell>
                {props.captain.id === player.id ? (
                  <Typography sx={{ 
                    fontWeight: 600,
                  }}>
                    {player.firstName} {player.lastName}
                    <Typography 
                      component="span" 
                      sx={{ 
                        ml: 0.5,
                        color: MCMASTER_COLOURS.grey,
                        fontStyle: 'italic',
                      }}
                    >
                      (Captain)
                    </Typography>
                  </Typography>
                ) : (
                  `${player.firstName} ${player.lastName}`
                )}
              </TableCell>
              <TableCell>{player.email}</TableCell>
              <TableCell>{player.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
