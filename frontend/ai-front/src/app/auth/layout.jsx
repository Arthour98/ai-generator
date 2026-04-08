"use client";
import react from "react";
import { useState, useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useTheme } from "@chakra-ui/react";


export default function Layout({ children }) {
  const theme = useTheme();
  const boxRef = useRef(null);
  const [linearGradient, setLinearGradient] = useState(
    `linear-gradient(to bottom right, ${theme.colors.teal[500]} 30%, ${theme.colors.blue[500]} 100%)`
  );

  const handleGradientChange = (e) => {
    const box = boxRef.current; // always use the container
    if (!box) return;

    const rect = box.getBoundingClientRect(); // container dimensions
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    setLinearGradient(
      `linear-gradient(${angle}deg, ${theme.colors.teal[300]}, ${theme.colors.blue[500]})`
    );
  };

  const resetGradient = (e) => {
    setLinearGradient(
      `linear-gradient(to bottom right, ${theme.colors.teal[500]} 30%, ${theme.colors.blue[500]} 100%)`
    );
  }

  return (
    <Box
      ref={boxRef}
      w="50%"
      minH="75vh"
      mx="auto"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
      onMouseMove={handleGradientChange}
      onMouseLeave={resetGradient}
      bg={linearGradient}
      borderRadius="30px"
      boxShadow="0px 10px 400px rgba(49, 130, 206, 0.6)"
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%,-50%)"
    >
      {children}
    </Box>
  );
}