"use client";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import SettingsBar from "@/components/partials/settingsBar";
import { useState, useEffect } from "react";
import { query } from "@/hooks/fetch";
import { Box, Text, Flex, Card, VStack, Divider } from "@chakra-ui/react";
import FriendsBar from "../../components/custom-components/friendsBar";
import CustomAvatar from "@/components/custom-components/avatar";
import CustomSwitch from "@/components/custom-components/customSwtich";

export default function ChatPage() {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [profile, setProfile] = useState();
    const [nickName, setNickname] = useState();
    const [activityStatus, setActivityStatus] = useState(false);

    const imageRender = (src) => {
        if (src.startsWith("/storage")) {
            return `http://localhost:8000${src}`;
        }
        else {
            return src;
        }
    }

    const getProfile = async () => {
        const userId = user?.id;
        const data = {
            user_id: userId
        }
        const res = await query("http://localhost:8000/api/profile", { params: data })

        if (res) {
            const profile = res.profile;
            const settings = res.profile?.settings;
            setProfile(profile);
            setNickname(profile.nickname);
            // setCountry(profile.country);
            setImage(profile.image_profile);
            // setBackgroundColor(settings?.background_color);
            // setTextColor(settings?.text_color);
            // setOpenMatrix(settings?.matrix);
        }
        else {
            console.log("error fetching profile");
        }
    }

    useEffect(() => {
        if (!user) return;
        getProfile();
    }, [user]);



    return (
        <>
            <Flex direction={"row"} justifyContent={"flex-start"} overflowY="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
                <Sidebar userId={user?.id} />
                <Flex direction={"column"} alignItems={"center"} width={"60%"}>
                    <SettingsBar ProfileImage={imageRender(image)} />
                    <Box w="100%"
                        position
                        padding={4}
                        display={"flex"}
                        shadow={"md"}
                        minH={"85vh"}
                        height={"85vh"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        rowGap={3}
                        bg={"blackAlpha.800"}
                        borderRadius={12}
                        color={'white'}
                        overflowY="hidden"
                    >
                        <Box width="100%" height="15%" display="flex" alignItems="center" gap="1rem"
                            backgroundColor="whiteAlpha.500" borderRadius="15px" padding="0.5rem 1rem">
                            <CustomAvatar src={imageRender(image)} noScale={true} />
                            <CustomSwitch value={activityStatus} setValue={() => setActivityStatus(!activityStatus)} />
                            <Box>Status:<Text color={activityStatus ? "green.800" : "red.800"}>{activityStatus ? "Online" : "Offline"}</Text></Box>
                        </Box>

                        {/* main-chat-div */}
                        <Box width={"100%"} minH={"80%"}
                            display="flex" >
                            <Box flexBasis={"20%"} height="100%" backgroundColor={"blackAlpha.600"}>

                            </Box>
                            <Box flexBasis={"80%"} height="100%" backgroundColor={"blackAlpha.700"}>

                            </Box>
                        </Box>

                    </Box>

                </Flex>
                <FriendsBar open={true}>
                    <p>Hello world</p>
                </FriendsBar>
            </Flex>
        </>
    );

}
