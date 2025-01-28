import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; // replace with your backend port

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [playerId, setPlayerId] = useState(null);
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
      console.log("Login response:", res);
      if (res) {
        setPlayerId(res.playerId);
        setToken(res.token);
        localStorage.setItem("site", res.token);
        navigate("/home");
        return;
      }

      throw new Error(res.message);
    } catch (err) {
      throw err;
    }
  };

  const logOut = () => {
    setPlayerId(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, playerId, login, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
