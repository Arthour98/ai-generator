"use client";

import Image from "next/image";
import Login from "@/components/auth/login";
import next from "next";
import {useRouter} from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { useEffect } from "react";


export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect on landing if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth"); // redirect to login page
    }
  }, [user, router]);

  if (!user) return <p>Loading...</p>; // optional loading

  return <h1>Welcome, {user.name}</h1>;
}