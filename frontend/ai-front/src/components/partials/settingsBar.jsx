"use client";
import { Box ,Icon} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import CustomAvatar from "@/components/custom-components/avatar";
import { IoIosSettings } from "react-icons/io";
import { useState } from "react";
import NavLink from "./NavLink";


    const fadeIn = keyframes`
  from {
    height:0;
  }
  to {
    height:150px;
  }
`;

const fadeOut = keyframes`
  from {
    height:150px;
  }
  to {
    height: 0;
  }
`;

export default function SettingsBar() {

    const [isHovering,setIsHovering]=useState(false);
    const [openDropDown,setOpenDropDown]=useState(false);



    const handleHover=()=>
    {
        setIsHovering(true);
    }

    const openDropDownMenu=(openDropDown)=>
    {
        setOpenDropDown(!openDropDown);
    }

    return (
                  <Box height={100} w={"100%"} display={"flex"} alignItems={"center"} gap={8} >
                    <CustomAvatar shape={"circle"} size={"lg"} src={"https://images.saymedia-content.com/.image/t_share/MTc0OTkxMDc3NDEyNTEzNzYw/top-10-best-k-pop-girl-groups.jpg"} opacity={0.6} scale={1} />
                    <Box height={"50px"} display={"flex"} alignItems="center" position="relative" >
                      <Icon as={IoIosSettings} width={50}
                       _hover={isHovering ? { transform: "scale(1.2)",color:"gray.300" } : {}} height={40}
                        color={"white"}  cursor={"pointer"}
                        onMouseEnter={()=>handleHover()}
                        onClick={() => openDropDownMenu(openDropDown)}/>
                        
                            <Box position="absolute" top="100%" left={0}
                            display={"flex"} justifyContent={"center"} flexDirection={"column"}
                              gap={4} px={4} borderRadius={12} bg="white" boxShadow="md"
                              backgroundColor={"purple.300"} width={200} flexWrap={"nowrap"}
                              animation={`${openDropDown ? fadeIn : fadeOut} 0.5s linear`}
                              height={openDropDown ? "150px" : "0"}
                              overflow={"hidden"} 
                            >
                                <NavLink href="/settings/profile">Profile-settings</NavLink>
                                <NavLink href="/settings/account">Account-settings</NavLink>
                                <NavLink href="/settings/theme">Theme</NavLink>
                            </Box>
                        
                    </Box>
                  </Box>
    )
}