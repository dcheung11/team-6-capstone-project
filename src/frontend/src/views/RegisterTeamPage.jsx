import NavBar from "../components/NavBar"
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import {createTeam} from "../api/team"

export default function MyTeamPage() {
    const [teamName, setTeamName] = useState("");
    const [division, setDivision] = useState("");
  
    const handleTeamNameChange = (e) => {
      setTeamName(e.target.value);
    };
  
    const handleDivisionChange = (e) => {
      setDivision(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Team Name:", teamName);
      console.log("Selected Division:", division);
      createTeam(teamName, division, "captainName", ["captainName", "player2", "player3"])
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <Container maxWidth="sm" sx={{ py: 4 }}>
                
            <Typography
            variant="h1"
            sx={{
              fontSize: "4rem",
              fontWeight: 700,
              mb: 6,
            }}
          >
            Register Team
          </Typography>
        
                <form onSubmit={handleSubmit}>
                <TextField
                    label="Team Name"
                    variant="outlined"
                    fullWidth
                    value={teamName}
                    onChange={handleTeamNameChange}
                    sx={{ mb: 2 }}
                />
        
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Division</InputLabel>
                    <Select
                    value={division}
                    onChange={handleDivisionChange}
                    label="Division"
                    required
                    >
                    <MenuItem value="A">Division A</MenuItem>
                    <MenuItem value="B">Division B</MenuItem>
                    <MenuItem value="C">Division C</MenuItem>
                    <MenuItem value="D">Division D</MenuItem>
                    </Select>
                </FormControl>
        
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  sx={{
                    fontWeight: 500,
                  bgcolor: "black",
                  color: "white",
                  textTransform: "none",
                  py: 1.5,
                  borderRadius: "30px"
                }}>
                    Register Team
                </Button>
                </form>
            </Container>
        </div>
    );
}