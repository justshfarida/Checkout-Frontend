import {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  //this stores accessToken in reactState
  const [accessToken, setAccessToken] =
    useState(null);

  function login(token) {
    setAccessToken(token);

    api.defaults.headers.common.Authorization =
      `Bearer ${token}`; //every request after that login carries this header
  }

  function logout() {
    setAccessToken(null);

    delete api.defaults.headers.common.Authorization;

    localStorage.removeItem("refreshToken");
  }

  const isAuthenticated = Boolean(accessToken); //if there is jwt it is true then

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}