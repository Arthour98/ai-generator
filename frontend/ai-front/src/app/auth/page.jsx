"use client";

import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";



export default function AuthPage() {
  const router = useRouter();
  const [openLogin, setOpenLogin] = useState(true);
  const [openRegister, setOpenRegister] = useState(false);

  const handleOpenLogin = () => {
    setOpenLogin(false);
    setOpenRegister(true);
  }  // switch to register form

  const handleOpenRegister = () => {
    setOpenRegister(false);
    setOpenLogin(true);
  } // switch to login form



  return (
    <>
      <Login open={openLogin} setOpen={handleOpenLogin} loginPhase={openLogin ? true : false} />
      <Register open={openRegister} setOpen={handleOpenRegister} registerPhase={openRegister ? true : false} />
    </>
  );
}