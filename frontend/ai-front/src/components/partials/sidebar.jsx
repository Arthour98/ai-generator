"use client"
import { Box,Flex,typography,Text } from "@chakra-ui/react";
import React, { use } from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import { FaHome,FaImage,FaVideo,FaMusic } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { BsChatLeftDotsFill } from "react-icons/bs";
import {Icon} from "@chakra-ui/react";
import NavLink from "./NavLink";


export default function Sidebar({userId}) {
    const path=usePathname();
    

    return(
        <Flex direction={"column"} bg={"purple.300"} p={4}
         borderTopRightRadius={"md"} borderBottomRightRadius={"md"} boxShadow={"md"} gap={8} height={"100%"}
          minW={"200px"} maxW={"200px"} >

         <NavLink href={`/home/${userId}`}>
                <Icon as={FaHome} boxSize={5} />
                <Text fontSize={"md"} fontWeight={"500"}>Home</Text>
         </NavLink>

         <NavLink href={`/image-generator/${userId}`}>
               <Icon as={FaImage} boxSize={5} />
               <Text fontSize={"md"} fontWeight={"500"}>Image generator</Text>
         </NavLink>

         <NavLink href={`/video-generator/${userId}`}>
               <Icon as={FaVideo} boxSize={5} />
               <Text fontSize={"md"} fontWeight={"500"}>Video generator</Text>
         </NavLink>
     

      <NavLink href={`/text-generator/${userId}`}>
         <Icon as={IoDocumentTextSharp} boxSize={5} />
         <Text fontSize={"md"} fontWeight={"500"}>Text generator</Text>
      </NavLink>

      <NavLink href={`/text-generator/${userId}`}>
               <Icon as={IoDocumentTextSharp} boxSize={5}/>
               <Text fontSize={"md"} fontWeight={"500"}>Text generator</Text>
           </NavLink>
         

         <NavLink href={`/chatbot/${userId}`}>
            <Icon as={TbMessageChatbotFilled} boxSize={5} />
            <Text fontSize={"md"} fontWeight={"500"}>Chatbot</Text>
         </NavLink>

         <NavLink href={`/music-room/${userId}`}>
            <Icon as={FaMusic} boxSize={5} />
            <Text fontSize={"md"} fontWeight={"500"}>Radio</Text>
         </NavLink>

         <NavLink href={`/chat-room/${userId}`}>
            <Icon as={BsChatLeftDotsFill} boxSize={5} />
            <Text fontSize={"md"} fontWeight={"500"}>Chat</Text>
         </NavLink>
        </Flex>
    )
}



   
        



