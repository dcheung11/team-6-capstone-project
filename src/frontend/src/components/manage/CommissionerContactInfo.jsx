import React, { useState } from "react";
import { 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper
} from "@mui/material";
import ContactInfoTable from "../ContactInfoTable";

// McMaster colours - AI Generated
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

export default function CommissionerContactInfo({ seasons }) {
  const [selectedSeason, setSelectedSeason] = useState("");

  // Set initial season if available
  React.useEffect(() => {
    if (seasons && seasons.length > 0 && !selectedSeason) {
      setSelectedSeason(seasons[0]._id);
    }
  }, [seasons]);

  if (!seasons || seasons.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          color: MCMASTER_COLOURS.grey,
          bgcolor: MCMASTER_COLOURS.lightGrey,
          borderRadius: 2
        }}
      >
        <Typography variant="h6">No seasons available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px',
          bgcolor: 'white'
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            color: MCMASTER_COLOURS.maroon,
            fontWeight: 700,
            mb: 3,
            fontSize: '2rem'
          }}
        >
          Team Contact Information
        </Typography>

        <FormControl 
          sx={{ 
            minWidth: 220,
            mb: 4,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: MCMASTER_COLOURS.maroon,
              },
              '&.Mui-focused fieldset': {
                borderColor: MCMASTER_COLOURS.maroon,
              }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: MCMASTER_COLOURS.maroon,
            }
          }}
        >
          <InputLabel>Season</InputLabel>
          <Select
            value={selectedSeason}
            label="Season"
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            {seasons.map((season) => (
              <MenuItem 
                key={season._id} 
                value={season._id}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: `${MCMASTER_COLOURS.maroon}14`,
                    '&:hover': {
                      backgroundColor: `${MCMASTER_COLOURS.maroon}20`,
                    }
                  },
                  '&:hover': {
                    backgroundColor: `${MCMASTER_COLOURS.maroon}0A`,
                  }
                }}
              >
                {season.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSeason && (
          <Box sx={{ mt: 2 }}>
            <ContactInfoTable currentSeasonId={selectedSeason} allSeasons={seasons} />
          </Box>
        )}
      </Paper>
    </Box>
  );
} 