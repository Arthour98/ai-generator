"use client";
import { useState,useRef,useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Box, Text } from "@chakra-ui/react";


export default function ColorPicker({w,h,radius,initialColor,top,left,label})
{
    const  [color,setColor]=useState("#FFFF");
    const [open,setOpen]=useState(false);
    const pickerRef=useRef(null);

  

 useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        console.log(pickerRef)
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);


    return(
        <Box display={"flex"} gap={"10px"}>
            <Text alignContent={"end"}  color={"white"} >{label}</Text>
            <Box w={w} h={h} bg={"white"} onClick={()=>setOpen(true)}
            border={"1px solid black"} padding={"0.33rem"} position="relative"
            borderRadius={radius ? radius : "0.33rem"}>
                <Box width={"100%"}
                height={"100%"}
                bg={color}
                borderRadius={radius? radius/2 : "0.33rem"}
                >
                </Box>
                {open&&
                <Box
                    ref={pickerRef}
                    position="absolute"
                    top={top ? `${top}%` : "100%"}
                    left={left ? `${left}px` : "0"}
                    border="1px solid black"
                    borderRadius="12px"
                    zIndex={10}
                    boxShadow="0 0 10px rgba(0,0,0,0.3)"
                >
                <HexColorPicker color={color}
                onChange={setColor} 
                style=
                {{
                    position:"absolute",
                    top:top?`${top}%` : "100%",
                    left:left? `${left}px` : "100%",
                    border:"10px solid black",
                    borderRadius:"12px"

                }}
                />
                </Box>
                }
            </Box>
        </Box>
    )
}
