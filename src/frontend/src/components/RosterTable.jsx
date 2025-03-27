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

// McMaster colours - AI generated
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

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
            <TableCell>Player</TableCell>
            <TableCell>Email</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
