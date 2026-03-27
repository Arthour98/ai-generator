"use client";
import React from "react";
import { Avatar, HStack } from "@chakra-ui/react"
import { useState, useEffect } from "react";




export default function CustomAvatar({ shape, src, opacity, scale, zIndex, position, noScale, w = "4rem", h = "4rem" }) {

    const [isHovering, setIsHovering] = useState(false);


    const handleHover = () => {
        if (noScale) return;
        setIsHovering(true);
    };



    return (
        <HStack
            position={position ?? "relative"}
            zIndex={zIndex}
            justifyContent={"center"}
            alignItems={"center"}
            opacity={isHovering ? 1 : opacity}
            onMouseEnter={() => handleHover()}
            onMouseLeave={() => setIsHovering(false)}
            transition="all 0.2s ease-in-out"
            transform={isHovering ? "scale(1.3)" : `scale(${scale})`}
            cursor="pointer"

        >
            <Avatar h={h} w={w} scale={isHovering ? 1.3 : 1} shape={shape} src={src} opacity={opacity} />
        </HStack>
    );
}
