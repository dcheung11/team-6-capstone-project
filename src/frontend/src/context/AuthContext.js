import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  playerId: null,
  token: null,
  login: () => {},
  logOut: () => {},
});
