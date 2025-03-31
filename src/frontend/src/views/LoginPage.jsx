// Author: Damien Cheung
// Description: LoginPage is the main login page for the application.
// Last Modified: 2025-02-28

import { Box, Container, Typography } from "@mui/material";
import LoginForm from "../components/Forms/LoginForm";

// LoginPage: The main login page for the application
export default function LoginPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Box
        sx={{
          width: "50%",
          bgcolor: "#7a003c",
          p: 8,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h1"
            sx={{
              color: "white",
              fontSize: "3.5rem",
              mb: 3,
              lineHeight: 1.2,
              fontWeight: 900,
            }}
          >
            McMaster GSA Softball League
          </Typography>
          <img
            src="/images/mcmaster_crest.png"
            alt="GSA Logo"
            style={{
              width: "250px",
              height: "300px",
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: 6 }}>
            <Typography variant="h2" sx={{ fontSize: "2rem", mb: 1 }}>
              Login/Sign Up to Access League
            </Typography>
          </Box>
          <LoginForm />
        </Container>
      </Box>
    </Box>
  );
}
