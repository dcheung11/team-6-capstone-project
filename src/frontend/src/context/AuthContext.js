// Author: Damien Cheung
// Description: This file contains the AuthContext for managing authentication state in the application.
// Last Modified: 2025-02-16

import { createContext } from "react";

// AuthContext: Context for managing authentication state
export const AuthContext = createContext({
  isLoggedIn: false,
  playerId: null,
  token: null,
  login: () => {},
  logOut: () => {},
});
