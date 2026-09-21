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

  const [user, setUser] = useState(null);

  async function loadCurrentUser() {
    if (!accessToken) {
      setUser(null);
      return;
    }

    try {
      const response =
        await api.get("/user/me");

      setUser(response.data);

      return response.data;
    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );

      throw error;
    }
  }

  function login(token) {
    setAccessToken(token);

    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      token
    );

    api.defaults.headers.common.Authorization =
      `Bearer ${token}`;
  }

  async function logout() {
    try {
      await api.post("/logout");
    } finally {
      setAccessToken(null);
      setUser(null);

      localStorage.removeItem(
        ACCESS_TOKEN_KEY
      );

      delete api.defaults.headers.common.Authorization;
    }
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
              await api.post("/token");

            const newAccessToken =
              response.data.jwt;

            login(newAccessToken);

            originalRequest.headers.Authorization =
              `Bearer ${newAccessToken}`;

            return api(originalRequest);
          } catch (refreshError) {
            logout();

            return Promise.reject(
              refreshError //simple return is like that: promise.resolve(undefined)
            );
          }
        }
      );

    return () => {
      api.interceptors.response.eject(
        interceptor //cleanup function, unregister the interceptor
      );
    };
  }, [accessToken]);

  // useEffect(() => {
  //   if (accessToken) {
  //     loadCurrentUser().catch(() => {});
  //   } else {
  //     setUser(null);
  //   }
  // }, [accessToken]);

  const isAuthenticated =
    Boolean(accessToken);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated,
        user,
        login,
        logout,
        loadCurrentUser,
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