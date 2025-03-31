import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; // replace with your backend port

// AuthProvider component: Provides authentication context to the application
// It manages the authentication state, including login and logout functionality
// It uses local storage to persist the authentication state across sessions
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playerId, setPlayerId] = useState(localStorage.getItem("playerId") || null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();
  const login = async (email, password) => {
    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/players/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const res = await response.json();

      if (res.playerId) {
        setPlayerId(res.playerId);
        setToken(res.token);
        setIsLoggedIn(true);
        localStorage.setItem("site", res.token);
        localStorage.setItem("playerId", res.playerId);
        localStorage.setItem("email", res.email);
        localStorage.setItem("role", res.role);
        navigate("/home");
        return;
      }

      throw new Error(res.message);
    } catch (err) {
      throw err;
    }
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setPlayerId(null);
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("playerId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/");
  };

  return <AuthContext.Provider value={{ isLoggedIn, token, playerId, login, logOut }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
