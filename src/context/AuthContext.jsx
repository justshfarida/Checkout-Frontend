import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/client";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "accessToken";

function getInitialAccessToken() {
  const token =
    localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    api.defaults.headers.common.Authorization =
      `Bearer ${token}`;
  }

  return token;
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] =
    useState(getInitialAccessToken);

  function login(token) {
    setAccessToken(token);

    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      token
    );

    api.defaults.headers.common.Authorization =
      `Bearer ${token}`;
  }

  function logout() {
    setAccessToken(null);

    localStorage.removeItem(
      ACCESS_TOKEN_KEY
    );

    delete api.defaults.headers.common.Authorization;
  }

  useEffect(() => {
    const interceptor =
      api.interceptors.response.use(
        (response) => response,

        async (error) => {
          const originalRequest =
            error.config;

          const isUnauthorized =
            error.response?.status === 401;

          const hasAccessToken =
            Boolean(accessToken);

          const isRefreshRequest =
            originalRequest?.url === "/token";

          const alreadyRetried =
            originalRequest?._retry;

          if (
            !isUnauthorized ||
            !hasAccessToken ||
            isRefreshRequest ||
            alreadyRetried
          ) {
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            const response =
              await api.get("/token");

            const newAccessToken =
              response.data.jwt;

            login(newAccessToken);

            originalRequest.headers.Authorization =
              `Bearer ${newAccessToken}`;

            return api(originalRequest);
          } catch (refreshError) {
            logout();

            return Promise.reject(
              refreshError
            );
          }
        }
      );

    return () => {
      api.interceptors.response.eject(
        interceptor
      );
    };
  }, [accessToken]);

  const isAuthenticated =
    Boolean(accessToken);

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
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}