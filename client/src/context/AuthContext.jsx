import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user from backend
  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        method: "GET",
        credentials: "include",  // ✅ Include cookies
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("User data from profile:", data);
        setUser(data.user);  // ✅ Set user state
      } else {
        console.warn("User not authenticated");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };
  

  // Trigger profile fetch after OAuth redirection
  useEffect(() => {
    const checkGoogleAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("code")) {
        console.log("Detected Google OAuth redirection.");
        getUser();   // ✅ Fetch the authenticated user
      } else {
        setLoading(false);  // ✅ Prevent infinite loading on non-OAuth routes
      }
    };
    checkGoogleAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });

      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Prevent infinite loading
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
