"use client";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import SettingsBar from "@/components/partials/settingsBar";
import { useState, useEffect, useCallback } from "react";
import { query } from "@/hooks/fetch";
import { Box, Text, Flex, Card, VStack, Divider, Button, filter } from "@chakra-ui/react";
import CustomInput from "@/components/custom-components/customInput";
import styles from "@/components/custom-components/components.module.css";
import { AspectRatio } from "@chakra-ui/react"
import { Image } from "@chakra-ui/react";
import CustomSkeleton from "@/components/custom-components/skeleton";
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faCircleArrowRight, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@/components/custom-components/CustomTooltip"
import DownloadItem from "@/utils/downloadItem";


export default function ImageGeneratorPage() {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [profile, setProfile] = useState();
    const [queryy, setQueryy] = useState("");
    const [generated, setGenerated] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [videoUrl, setVideoUrl] = useState(null);


    //tooltip
    const [showTooltip, setShowTooltip] = useState(false);

    const imageRender = (src) => {
        if (src.startsWith("/storage")) {
            return `http://localhost:8000${src}`;
        }
        else {
            return src;
        }
    }

    useEffect(() => {
        if (generated) {
            setIsLoading(false);
        }
        else {
            setIsLoading(true);
        }
    }, [generated])


    const getProfile = async () => {
        const userId = user?.id;
        const data = {
            user_id: userId
        }
        const res = await query("http://localhost:8000/api/profile", { params: data })

        if (res) {
            const profile = res.profile;
            setProfile(profile);
            setImage(profile.image_profile);
        }
        else {
            console.log("error fetching profile");
        }
    }
    useEffect(() => {
        if (!user) return
        getProfile();
    }, [user])

    const submitQuery = async () => {
        const data = {
            videoQuery: queryy
        }
        const req = await query("http://localhost:8000/api/pexels/videoSearch", { method: "post", data: data });

        setGenerated(req);

    }
    useEffect(() => {
        console.log(generated)
    }, [generated]);

    useEffect(() => {
        if (generated && generated.length > 0) {
            console.log(generated)
            console.log("imgIndex", imgIndex)
            setImageUrl(generated[imgIndex]?.largeImageURL)
        }
        else {
            return;
        }
    }, [generated])


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
                        minH={"80vh"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        rowGap={10}
                        bg={"blackAlpha.800"}
                        borderRadius={12}
                        color={'white'}
                    >
                        <Box className={styles.videoContainer}>

                            <video src={videoUrl}>

                            </video>

                        </Box>
                        <CustomInput label={"Describe your video"} paddingY={5} gap={5} value={queryy} w={"60%"} setValue={setQueryy} />
                        <Button bg={"green.600"}
                            _hover={{ bg: "green.300" }}
                            onClick={submitQuery}
                        >Generate</Button>
                    </Box>

                </Flex>
            </Flex>
        </>
    );

}