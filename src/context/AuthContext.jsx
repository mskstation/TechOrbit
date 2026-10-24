
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const SESSION_KEY = "techorbit_user";
const ACCOUNTS_KEY = "techorbit_demo_accounts";
const TOKEN_KEY = "techorbit_token";
const DEMO_KEY = "techorbit_demo_mode";

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function readAccounts() {
  try {
    const accounts = JSON.parse(
      localStorage.getItem(ACCOUNTS_KEY) || "[]"
    );
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, "demo-token");
  localStorage.setItem(DEMO_KEY, "true");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);
  const [demoMode, setDemoMode] = useState(
    () => localStorage.getItem(DEMO_KEY) === "true"
  );

  useEffect(() => {
    function syncSession(event) {
      if (event.key === SESSION_KEY) {
        setUser(readSession());
      }
      if (event.key === DEMO_KEY) {
        setDemoMode(localStorage.getItem(DEMO_KEY) === "true");
      }
    }

    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  async function register(name, email, password) {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      throw new Error("Name, email aur password bharna zaroori hai.");
    }

    if (password.length < 6) {
      throw new Error("Password kam se kam 6 characters ka hona chahiye.");
    }

    const accounts = readAccounts();

    if (accounts.some((account) => account.email === cleanEmail)) {
      throw new Error(
        "Is email se account pehle se bana hua hai. Login karein."
      );
    }

    const account = {
      id: `demo-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password,
    };

    localStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify([...accounts, account])
    );

    const publicUser = {
      _id: account.id,
      name: account.name,
      email: account.email,
      isDemo: true,
    };

    saveSession(publicUser);
    setUser(publicUser);
    setDemoMode(true);

    return publicUser;
  }

  async function login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      throw new Error("Email aur password enter karein.");
    }

    const accounts = readAccounts();

    const account = accounts.find(
      (item) =>
        item.email === cleanEmail &&
        item.password === password
    );

    if (!account) {
      throw new Error(
        "Email ya password galat hai. Wahi details use karein jo Signup ke waqt di thi."
      );
    }

    const publicUser = {
      _id: account.id,
      name: account.name,
      email: account.email,
      isDemo: true,
    };

    saveSession(publicUser);
    setUser(publicUser);
    setDemoMode(true);

    return publicUser;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DEMO_KEY);

    setUser(null);
    setDemoMode(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        demoMode,
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
