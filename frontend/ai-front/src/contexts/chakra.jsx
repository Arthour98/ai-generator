"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default function ChakraWrapper({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}