import { useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { login, signup } from "../api/player";

export default function LoginForm() {
  const [loginState, setLoginState] = useState(true); // true for login, false for signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertContent, setAlertContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginState) {
      login(email, password)
        .then(() => {
          setAlertContent("Login successful.");
          setAlertSeverity("success");
          setAlert(true);
          window.location.href = "/home";
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

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
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
          onChange={(e) => setEmail(e.target.value)}
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
        {/* TODO */}
        {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Link
            href="#"
            underline="hover"
            sx={{ color: "text.secondary", fontSize: "0.875rem" }}
          >
            Forgot Password?
          </Link>
        </Box> */}
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
        Toggle Login/Signup{" "}
        <Button
          type="text"
          underline="hover"
          sx={{ color: "black" }}
          onClick={(e) => {
            e.preventDefault();
            setLoginState(!loginState);
          }}
        >
          {loginState ? "Sign Up" : "Login"}
        </Button>
      </Typography>
    </Box>
  );
}
