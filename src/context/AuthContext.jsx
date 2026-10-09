import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY = "techorbit_accounts";
const SESSION_KEY = "techorbit_user";

function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

async function hashPassword(password) {
  if (!window.crypto?.subtle) {
    throw new Error("Secure password hashing is not supported in this browser.");
  }

  const data = new TextEncoder().encode(password);
  const hash = await window.crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

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
    const normalizedEmail = email.trim().toLowerCase();
    const users = readUsers();

    if (users.some((item) => item.email === normalizedEmail)) {
      throw new Error("Is email se account pehle se bana hua hai.");
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

    const publicUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    setUser(publicUser);

    return publicUser;
  }

  async function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    const users = readUsers();

    const foundUser = users.find(
      (item) =>
        item.email === normalizedEmail &&
        item.passwordHash === passwordHash
    );

    if (!foundUser) {
      throw new Error("Email ya password galat hai.");
    }

    const publicUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    setUser(publicUser);

    return publicUser;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), register, login, logout }}
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