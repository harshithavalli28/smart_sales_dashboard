import { createContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ login
  // ✅ login
const login = async (email, password) => {
  try {
    const res = await API.post("/auth/login", { email, password });

    const loggedInUser = {
      token: res.data.token,
      role: res.data.role,
      name: res.data.name,
      email: res.data.email,
    };

    // Save whole user object
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setUser(loggedInUser);

    // 👇 return data so Login.jsx can use it
    return loggedInUser;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
};

  // ✅ signup
  const signup = async (name, email, password, role) => {
    await API.post("/auth/signup", { name, email, password, role });
  };

  // ✅ logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ load profile on refresh
  const loadProfile = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
