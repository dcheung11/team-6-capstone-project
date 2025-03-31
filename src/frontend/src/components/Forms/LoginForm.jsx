// Author: Damien Cheung
// Description: This component provides a login and signup form for users.
// Last Modified: 2025-02-16

import { useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { signup } from "../../api/player";
import { useAuth } from "../../hooks/AuthProvider";

// LoginForm: A form component for user login and signup.
export default function LoginForm() {
  const [loginState, setLoginState] = useState(true); // true for login, false for signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertContent, setAlertContent] = useState("");
  const auth = useAuth();
  const [waiverConfirmed, setWaiverConfirmed] = useState(false);

  // Handle login/signup submit button click
  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginState) {
      auth
        .login(email, password)
        .then(() => {
          setAlertContent("Login successful.");
          setAlertSeverity("success");
          setAlert(true);
        })
        .catch((error) => {
          setAlertContent(error.message);
          setAlertSeverity("error");
          setAlert(true);
        });
    } else {
      signup(firstName, lastName, email, password)
        .then(() => {
          setLoginState(true);
          setAlertContent("Account created successfully. Please login.");
          setAlertSeverity("success");
          setAlert(true);
        })
        .catch((error) => {
          setAlertContent(error.message);
          setAlertSeverity("error");
          setAlert(true);
        });
    }
  };

  // Handle Enter key press to submit the form
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      onKeyDown={handleKeyDown}
    >
      {alert ? <Alert severity={alertSeverity}>{alertContent}</Alert> : <></>}
      {!loginState && (
        <Box>
          <Typography
            component="label"
            htmlFor="first-name"
            sx={{
              display: "block",
              mb: 1,
              fontSize: "0.875rem",
              color: "text.secondary",
            }}
          >
            First Name
          </Typography>
          <TextField
            fullWidth
            id="first-name"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Box>
      )}
      {/* Toggle login/signup */}
      {!loginState && (
        <Box>
          <Typography
            component="label"
            htmlFor="last-name"
            sx={{
              display: "block",
              mb: 1,
              fontSize: "0.875rem",
              color: "text.secondary",
            }}
          >
            Last Name
          </Typography>
          <TextField
            fullWidth
            id="last-name"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </Box>
      )}

      <Box>
        <Typography
          component="label"
          htmlFor="email"
          sx={{
            display: "block",
            mb: 1,
            fontSize: "0.875rem",
            color: "text.secondary",
          }}
        >
          E-mail
        </Typography>
        <TextField
          fullWidth
          id="email"
          placeholder="Type your e-mail"
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
        />
      </Box>

      <Box>
        <Typography
          component="label"
          htmlFor="password"
          sx={{
            display: "block",
            mb: 1,
            fontSize: "0.875rem",
            color: "text.secondary",
          }}
        >
          Password
        </Typography>
        <TextField
          fullWidth
          id="password"
          type="password"
          placeholder="Type your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>

      <Button
        variant="contained"
        sx={{
          bgcolor: "black",
          "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
          borderRadius: 2,
        }}
        onClick={handleSubmit}
      >
        {loginState ? "Login" : "Sign Up"}
      </Button>
      <Typography align="center" sx={{ color: "text.secondary" }}>
        {loginState
          ? "Don't have an account? "
          : "Already have an account? "}
        <Button
          type="text"
          underline="hover"
          sx={{ color: "black", textDecoration: "underline" }}
          onClick={(e) => {
            e.preventDefault();
            setLoginState(!loginState);
            setWaiverConfirmed(false);
          }}
        >
          {loginState ? "Sign Up" : "Login"}
        </Button>
      </Typography>
    </Box>
  );
}
