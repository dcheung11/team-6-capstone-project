import { useState, useEffect } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { signup } from "../api/player";
import { useAuth } from "../hooks/AuthProvider";

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

      {!loginState && (
        <>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "text.secondary",
              mb: 1
            }}
          >
            Please complete the waiver form and confirm below:
          </Typography>
          <Box sx={{ width: '100%', height: '400px', border: '1px solid #ccc' }}>
            <iframe 
              width="100%"
              height="100%"
              src="https://forms.office.com/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HchGPxkBSqu9MvUTc8JXTFOBUNTUwWktNM09BNEZLQTY4WDhRV1pXTjlINy4u&embed=true" 
              frameBorder="0"
              marginWidth="0"
              marginHeight="0"
              style={{ border: 'none', maxWidth:'100%', maxHeight:'100vh' }}
              allowFullScreen
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              msallowfullscreen="true"
            />
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}>
            <input 
              type="checkbox" 
              id="waiver-confirm" 
              checked={waiverConfirmed}
              onChange={(e) => setWaiverConfirmed(e.target.checked)}
            />
            <Typography sx={{ fontSize: '0.875rem' }}>
              I confirm that I have completed and submitted the waiver form
            </Typography>
          </Box>
        </>
      )}

      <Button
        variant="contained"
        sx={{
          bgcolor: "black",
          "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
          borderRadius: 2,
        }}
        onClick={handleSubmit}
        // disabled={!loginState && !waiverConfirmed}
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
      
      {/* {!loginState && !waiverConfirmed && (
        <Typography 
          sx={{ 
            color: 'error.main', 
            fontSize: '0.875rem', 
            textAlign: 'center' 
          }}
        >
          Please complete the waiver form and check the confirmation box to enable sign up
        </Typography>
      )} */}
    </Box>
  );
}
