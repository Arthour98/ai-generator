"use client";
import { useState, useContext, createContext, useEffect } from "react";
import { query } from "../hooks/fetch";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const login = async (userName, password) => {
    const data = {
      name: userName,
      password: password,
    };
    try {
      const response = await axios.post("/api/login", data, {
        withCredentials: true,
      });
      if (response.data.user) {
        setUser(response.data.user);
        setIsLogged(true);
      }
      return response?.data;
    } catch (e) {
      return e;
    }
  };

  const logout = async () => {
    const response = await query("/api/logout", { method: "post" });
    if (response) {
      setUser(null);
      setIsLogged(false);
      router.push("/");
    }
  };

  const register = async (userName, email, password) => {
    const data = {
      name: userName,
      email: email,
      password: password,
    };
    const response = await axios.post("/api/register", data, {
      withCredentials: true,
    });
    if (response.data.user) {
      setUser(response.data.user);
      setIsLogged(true);
    }
    return response.data;
  };

  useEffect(() => {
    if (path === "/auth") return;

    let cancelled = false;
    let timer;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user`, {
          credentials: "include",
        });

        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setIsLogged(true);
        } else {
          timer = setTimeout(fetchUser, 3000);
        }
      } catch {
        timer = setTimeout(fetchUser, 3000);
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [path]);


  useEffect(() => {
    const curr_path = path;
    let timer = setTimeout(() => {
      if (curr_path != '/auth' && !user && !isLogged) {
        router.push('/auth');
      }
    }, 4000)
    return () => clearTimeout(timer);
  }, [user, isLogged])

  return (
    <AuthContext.Provider
      value={{ user, isLogged, login, logout, register, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
