import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { signup } from "../api/player";

export default function LoginForm() {
  const [loginState, setLoginState] = useState(true); // true for login, false for signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginState) {
      // todo - implement send login request
      console.log("login: " + email, password);
    } else {
      // May need to add validation or better error handling here

      signup(firstName, lastName, email, password)
        .then((data) => {
          console.log("Signup response:", data);
        })
        .catch((error) => {
          console.error("Signup error:", error);
        });
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
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
