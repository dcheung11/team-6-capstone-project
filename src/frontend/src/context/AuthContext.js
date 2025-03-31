import { createContext } from "react";

// AuthContext: Context for managing authentication state
export const AuthContext = createContext({
  isLoggedIn: false,
  playerId: null,
  token: null,
  login: () => {},
  logOut: () => {},
});
