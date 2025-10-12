"use client";
import React from "react";
import { Avatar, HStack } from "@chakra-ui/react"
import {useState} from "react";



export default function CustomAvatar({shape,size,src,opacity,scale})
{

    const [isHovering,setIsHovering]=useState(false);


    const handleHover = () => {
        setIsHovering(true);
    };

   

    return(
        <HStack 
            justifyContent={"center"}
            alignItems={"center"}
            opacity={isHovering? 1: opacity}
            onMouseEnter={() => handleHover()}
            onMouseLeave={() => setIsHovering(false)}
            transition="all 0.2s ease-in-out"
            transform={isHovering ? "scale(1.3)" : `scale(${scale})`}
            cursor="pointer"
            >
          <Avatar scale={isHovering?1.3:1} shape={shape} size={size} src={src} opacity={opacity} />
        </HStack>
    );
}
