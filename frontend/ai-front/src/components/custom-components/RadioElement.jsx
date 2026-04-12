"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faCircleArrowLeft, faCircleArrowRight, } from '@fortawesome/free-solid-svg-icons';


export default function RadioElement({
    url,
    h = "50px",
    w = "100%",
    name,
    setIndex
}) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [error, setError] = useState(false);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setPlaying(true))
                    .catch((err) => {
                        console.error("Autoplay prevented:", err);
                        setError(true);
                    });
            }
        }
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play();
            setPlaying(true)
        }
    }, [url]);

    return (
        <Box w={w} h={h}
            display={"flex"}
            flexDirection={"column"}
            position="relative"
            boxShadow="0 0 10px 2px white"
            borderRadius="12px"
            overflow="hidden">
            {error && <Text color="red.400">Cannot play this stream.</Text>}
            <Image src={"/space.webp"}
                w={"full"} h={"full"}
                position="absolute"
                top={"0"}
                left="0"
            />
            <Text
                position="absolute"
                top="10px"
                left="50%"
                transform={"translate(-50%,0)"}
            >{name}</Text>
            <audio ref={audioRef} src={url} style={{ width: "100%" }} />
            <Box height={"80%"}
                borderBottom={"1px solid white"}
            >

            </Box>
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                h={{ base: "30%", lg: "20%" }}
                bg={"blackAlpha.700"}
                zIndex={30}
                columnGap={"20px"}
            >
                <Button h={{ base: "50%", lg: "60%" }} mt={2} bg="green.300 " onClick={() => setIndex(-1)} _hover={{ bg: "green.500" }}>
                    <FontAwesomeIcon icon={faCircleArrowLeft} color="white" />
                </Button>
                <Button h={{ base: "50%", lg: "60%" }} mt={2} onClick={togglePlay} bg="green.300 " _hover={{ bg: "green.500" }}>
                    <FontAwesomeIcon icon={playing ? faPause : faPlay} color="white" />
                </Button>
                <Button h={{ base: "50%", lg: "60%" }} mt={2} bg="green.300 " onClick={() => setIndex(+1)} _hover={{ bg: "green.500" }}>
                    <FontAwesomeIcon icon={faCircleArrowRight} color="white" />
                </Button>
            </Box>
        </Box >
    )
}