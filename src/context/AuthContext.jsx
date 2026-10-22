
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import authApi from "../services/authApi";

const AuthContext = createContext(null);
const SESSION_KEY = "techorbit_user";
const TOKEN_KEY = "techorbit_token";

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  useEffect(() => {
    const syncSession = (event) => {
      if (event.key === SESSION_KEY) {
        setUser(readSession());
      }
    };

    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  async function register(name, email, password) {
    try {
      const response = await authApi.post("/signup", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const publicUser = response.data.user;

      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      setUser(publicUser);

      // Signup ke baad login bhi karwao, taaki token mile.
      const loginResponse = await authApi.post("/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem(TOKEN_KEY, loginResponse.data.token);

      return publicUser;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Account create nahi ho paya."
      );
    }
  }

  async function login(email, password) {
    try {
      const response = await authApi.post("/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const publicUser = response.data.user;

      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      setUser(publicUser);

      return publicUser;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Login nahi ho paya."
      );
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        register,
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
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
