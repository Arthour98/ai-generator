"use client";
import { useRef, useState, useEffect } from "react";
import { Box, Flex, Text, Image, VStack, Divider, Card } from "@chakra-ui/react";
import CustomAvatar from "@/components/custom-components/avatar";
import Matrix from "@/components/custom-components/matrix";
import { imageRender } from "@/utils/imageRender";
export default function ViewClient({ profile, profSettings }) {



    const profileRef = useRef();
    const [openMatrix, setOpenMatrix] = useState();
    const [backgroundColor, setBackgroundColor] = useState();
    const [textColor, setTextColor] = useState();
    const [age, setAge] = useState()
    const [nickname, setNickname] = useState();
    const [country, setCountry] = useState();
    const [imageProfile, setImageProfile] = useState()


    useEffect(() => {
        if (!profile) return
        setNickname(profile.nickname);
        setAge(profile.age);
        setCountry(profile.country);
        setImageProfile(profile?.image_profile)
    }, [profile])

    useEffect(() => {
        setTextColor(profSettings?.text_color);
        setOpenMatrix(profSettings?.matrix);
        setBackgroundColor(profSettings?.background_color);

    }, [profSettings])


    if (!profile) {
        return (
            <Flex justify="center" align="center" height="80vh">
                <Text color="gray.400">Profile not available</Text>
            </Flex>
        );
    }



    return (
        <>
            <Flex direction={{ base: "column", lg: "row" }} justifyContent={"center"} alignItems="center" overflow={{ base: "visible", lg: "visible" }} overflowY="hidden" height={{ base: "auto", lg: "100vh" }}>
                <Flex direction={"column"} alignItems={"center"} width={{ base: "100%", lg: "60%" }}>
                    <Box w="100%"
                        position
                        padding={{ base: 4, lg: 8 }}
                        display={"flex"}
                        shadow={"md"}
                        minH={{ base: "auto", lg: "85vh" }}
                        height={{ base: "auto", lg: "85vh" }}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"start"}
                        rowGap={3}
                        bg={"blackAlpha.800"}
                        borderRadius={12}
                        color={'white'}
                        overflowY="hidden"
                        overflow={{ base: "visible", lg: "visible" }}
                    >

                        <Card height={"100%"}
                            minH={"100%"}
                            w="100%"
                            py={10} gap={10}
                            overflow={"hidden"}
                            alignItems="center"
                            bg={backgroundColor ?? "gray.700"}
                            color={textColor ?? "white"}
                            ref={profileRef} zIndex={30}
                            borderRadius={12}
                        >
                            {openMatrix && <Matrix elem={profileRef} start={openMatrix} />}
                            <CustomAvatar shape={"circle"} size={"lg"}
                                src={imageRender(imageProfile)}
                                opacity={0.6} scale={1}
                                zIndex={60}
                            />

                            <Flex flexDirection={"column"} width={{ base: "80%", md: "60%", lg: "50%" }} alignItems={"center"}>
                                <Text>Name: {nickname}</Text>
                                <Divider color="white" w="100%" />
                            </Flex>



                            <Flex flexDirection={"column"} width={{ base: "80%", md: "60%", lg: "50%" }} alignItems={"center"}>
                                <Text>Age: {age}</Text>
                                <Divider color="white" w="100%" />
                            </Flex>



                            <Flex flexDirection={"column"} width={{ base: "80%", md: "60%", lg: "50%" }} alignItems={"center"}>
                                <Text >Country: {country}</Text>
                                <Divider color="white" w="100%" />
                            </Flex>
                        </Card>
                    </Box>

                </Flex>
            </Flex>
        </>
    );
}