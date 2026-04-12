"use client";

import { Box, Flex, Text, Icon, Portal } from "@chakra-ui/react";
import { FaImage, FaVideo, FaMusic } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";
import NavLink from "./NavLink";

export default function MobileSidebar({ isOpen, onClose }) {

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <Portal>
            <Box
                position="fixed"
                top="0"
                left="0"
                width="100vw"
                height="100vh"
                bg="purple.300"
                opacity={"0.9"}
                zIndex={9999}
            >

                {/* sidebar */}
                <Flex
                    position="relative"
                    top="0"
                    left="0"
                    height="100vh"
                    width="100%"
                    zIndex={10000}
                    direction="column"
                    alignItems="center"
                    p={5}
                    gap={6}
                    boxShadow="2xl"
                    opacity="1"
                >

                    <Flex justify="center" align="center">
                        <Text color="white" fontSize="lg" fontWeight="bold">
                            Menu
                        </Text>
                    </Flex>
                    <Icon
                        as={IoMdClose}
                        boxSize={6}
                        cursor="pointer"
                        onClick={onClose}
                        _hover={{ color: "white" }}
                        position="absolute"
                        top="20px"
                        right="20px"
                        color="white"
                    />

                    {/* links */}
                    <Box display="flex" flexDirection="column"
                        w="35%" h="inherit" rowGap="2rem"
                    >
                        <NavLink href="/image-generator" onClick={onClose}>
                            <Icon as={FaImage} boxSize={5} />
                            <Text>Image generator</Text>
                        </NavLink>

                        <NavLink href="/video-generator" onClick={onClose}>
                            <Icon as={FaVideo} boxSize={5} />
                            <Text>Video generator</Text>
                        </NavLink>

                        <NavLink href="/chatbot" onClick={onClose}>
                            <Icon as={IoDocumentTextSharp} boxSize={5} />
                            <Text>Chatbot</Text>
                        </NavLink>

                        <NavLink href="/music-room" onClick={onClose}>
                            <Icon as={FaMusic} boxSize={5} />
                            <Text>Radio</Text>
                        </NavLink>

                        <NavLink href="/chat-room" onClick={onClose}>
                            <Icon as={BsChatLeftDotsFill} boxSize={5} />
                            <Text>Chat</Text>
                        </NavLink>
                    </Box>
                </Flex>
            </Box>
        </Portal>
    );
}