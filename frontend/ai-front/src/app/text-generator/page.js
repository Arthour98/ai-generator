"use client";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import SettingsBar from "@/components/partials/settingsBar";
import { useState, useEffect } from "react";
import { query } from "@/hooks/fetch";
import { Box, Text, Flex, Card, VStack, Divider } from "@chakra-ui/react";

export default function TextPage() {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [profile, setProfile] = useState();



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
            setCountry(profile.country);
            setImage(profile.image_profile);
            setBackgroundColor(settings?.background_color);
            setTextColor(settings?.text_color);
            setOpenMatrix(settings?.matrix);


        }
        else {
            console.log("error fetching profile");
        }
    }



    return (
        <>
            <Flex direction={"row"} justifyContent={"flex-start"} overflowY="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
                <Sidebar userId={user?.id} />
                <Flex direction={"column"} alignItems={"center"} width={"60%"}>
                    <SettingsBar ProfileImage={image} />
                    <Box w="100%" position padding={4} border={"1px solid black"} shadow={"md"} minH={"80vh"}>

                    </Box>

                </Flex>
            </Flex>
        </>
    );

}
