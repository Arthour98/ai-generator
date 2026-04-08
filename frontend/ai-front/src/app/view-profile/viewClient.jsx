"use client";
import { useRef, useState, useEffect } from "react";
import { Box, Flex, Text, Image, VStack, Divider, Card } from "@chakra-ui/react";
import CustomAvatar from "@/components/custom-components/avatar";
import Matrix from "@/components/custom-components/matrix";

export default function ViewClient({ profile, profSettings }) {

    const imageRender = (src) => {
        if (src) {
            if (src?.startsWith("/storage")) {
                return `http://localhost:8000${src}`;
            }
            else {
                return src;
            }
        }
        else {
            return;
        }
    }

    const profileRef = useRef();
    const [openMatrix, setOpenMatrix] = useState(profile?.matrix);
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
            <Flex direction={"row"} justifyContent={"center"} alignItems="center" overflow={"visible"} overflowY="hidden" height={"100vh"}>
                <Flex direction={"column"} alignItems={"center"} width={"60%"}>
                    <Box w="100%"
                        position
                        padding={8}
                        display={"flex"}
                        shadow={"md"}
                        minH={"85vh"}
                        height={"85vh"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"start"}
                        rowGap={3}
                        bg={"blackAlpha.800"}
                        borderRadius={12}
                        color={'white'}
                        overflowY="hidden"
                        overflow={"visible"}
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

                            <Flex flexDirection={"column"} width={"50%"} alignItems={"center"}>
                                <Text>Name: {nickname}</Text>
                                <Divider color="white" w="100%" />
                            </Flex>



                            <Flex flexDirection={"column"} width={"50%"} alignItems={"center"}>
                                <Text>Age: {age}</Text>
                                <Divider color="white" w="100%" />
                            </Flex>



                            <Flex flexDirection={"column"} width={"50%"} alignItems={"center"}>
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