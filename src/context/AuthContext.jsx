import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
//This stores the access token in React state:
  const [accessToken, setAccessToken] = useState(null);

  function login(token) {
    setAccessToken(token);
  }

  function logout() {
    setAccessToken(null);

    localStorage.removeItem("refreshToken");
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}