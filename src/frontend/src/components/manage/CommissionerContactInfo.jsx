import React, { useState } from "react";
import { 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import ContactInfoTable from "../ContactInfoTable";

export default function CommissionerContactInfo({ seasons }) {
  const [selectedSeason, setSelectedSeason] = useState("");

  // Set initial season if available
  React.useEffect(() => {
    if (seasons && seasons.length > 0 && !selectedSeason) {
      setSelectedSeason(seasons[0]._id);
    }
  }, [seasons]);

  if (!seasons || seasons.length === 0) {
    return <Typography>No seasons available</Typography>;
  }

  return (
    <Box>
      <FormControl sx={{ minWidth: 180, mb: 4 }}>
        <InputLabel>Season</InputLabel>
        <Select
          value={selectedSeason}
          label="Season"
          onChange={(e) => setSelectedSeason(e.target.value)}
        >
          {seasons.map((season) => (
            <MenuItem key={season._id} value={season._id}>
              {season.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedSeason && (
        <ContactInfoTable currentSeasonId={selectedSeason} />
      )}
    </Box>
  );
} 