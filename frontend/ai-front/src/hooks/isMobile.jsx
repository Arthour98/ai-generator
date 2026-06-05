import { useState, useEffect } from "react";

export const isMobile = () => {
  const getIsMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 991;
  };

  const [mobile, setMobile] = useState(getIsMobile);

  useEffect(() => {
    setMobile(getIsMobile());
  }, []);

  return mobile;
};
