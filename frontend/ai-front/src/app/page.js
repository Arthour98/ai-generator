"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { useEffect, useState } from "react";
import { Loader } from "@/components/partials/loader";

export default function Home() {
  const { user, isLogged } = useAuth();
  const router = useRouter();
  const [loader, setLoader] = useState(true);

  
  useEffect(() => {
    if (!user && !isLogged) {
      router.push("/auth"); 
    }
  }, [user, router, isLogged]);

  useEffect(() => {
    if (typeof window !== "undefined" || document.readyState !== "complete") {
      let t = setTimeout(() => {
        setLoader(false);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <>
      <Loader open={loader} setOpen={setLoader} />
    </>
  );
}
