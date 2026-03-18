"use client";

import Image from "next/image";
import Login from "@/components/auth/login";
import next from "next";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { useEffect, useState } from "react";
import { Loader } from "@/components/partials/loader";


export default function Home() {
  const { user, isLogged } = useAuth();
  const router = useRouter();
  const [loader, setLoader] = useState(true);



  // Redirect on landing if not authenticated
  useEffect(() => {
    if (!user && !isLogged) {
      router.push("/auth"); // redirect to login page
    }
  }, [user, router, isLogged]);

  useEffect(() => {
    if (typeof window !== 'undefined' || document.readyState !== "complete") {
      let t = setTimeout(() => {
        setLoader(false);
      }, 2500)
      return () => clearTimeout(t);
    }
  }, [])

  return (
    <>
      <Loader open={loader} setOpen={setLoader} />
    </>
  )
}