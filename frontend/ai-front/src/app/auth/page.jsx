"use client";

import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import { useState } from "react";



export default function AuthPage() {
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