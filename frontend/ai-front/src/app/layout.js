"use client";
import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import ChakraWrapper from "@/contexts/chakra";
import { AuthProvider, useAuth } from "@/contexts/auth";
import { Container } from "@chakra-ui/react";


import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {



  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ChakraWrapper>
            <Container maxW="container.xxl" py={0} px={0} bg={"gray.50"}
              minH="100vh" bgGradient={"linear(to-t, pink.400, teal.900)"}>
              {children}
            </Container>
          </ChakraWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
