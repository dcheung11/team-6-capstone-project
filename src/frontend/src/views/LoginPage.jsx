// Author: Damien Cheung
// Description: LoginPage is the main login page for the application.
// Last Modified: 2025-02-28

import { Box, Container, Typography } from "@mui/material";
import LoginForm from "../components/Forms/LoginForm";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { MCMASTER_COLOURS } from "../utils/Constants";

// LoginPage: The main login page for the application
export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          bgcolor: MCMASTER_COLOURS.maroon,
          p: { xs: 4, sm: 6, md: 8 },
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Box sx={{ mt: { xs: 4, md: 8 } }}>
          <Typography
            variant="h1"
            sx={{
              color: "white",
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
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
              width: isMobile ? "180px" : "250px",
              height: isMobile ? "216px" : "300px",
              maxWidth: "100%",
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
          p: { xs: 3, sm: 4 },
          width: "100%",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ mb: { xs: 4, md: 6 }, mt: { xs: 3, md: 0 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.75rem", md: "2rem" },
                mb: 1,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Login/Sign Up to Access League
            </Typography>
          </Box>
          <LoginForm />
        </Container>
      </Box>
    </Box>
  );
}
