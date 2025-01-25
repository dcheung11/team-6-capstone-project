import React from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Box,
  IconButton,
  Container,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

const NavBar = () => {
  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "#7A003C", height: 92 }}
    >
      <Container style={{ marginTop: "14px" }}>
        <Toolbar disableGutters sx={{ height: 64 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img
              src="/images/gsa.png"
              alt="GSA Logo"
              style={{
                marginRight: "32px",
                width: "50px",
                height: "50px",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button color="inherit" href="/home">
              Home
            </Button>
            <Button color="inherit" href="/announcements">
              Announcements
            </Button>
            <Button color="inherit" href="/team">
              My Team
            </Button>
            <Button color="inherit" href="/schedule">
              Schedule
            </Button>
            <Button color="inherit" href="/standings">
              Standings
            </Button>
            <Button color="inherit" href="/info">
              Useful Info
            </Button>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <IconButton color="inherit" size="large">
              <PersonIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
