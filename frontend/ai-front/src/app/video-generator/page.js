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
import VideoElement from "./videoElement";
import { clearInput } from "@/utils/clearInput";


export default function ImageGeneratorPage() {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [profile, setProfile] = useState();
    const [queryy, setQueryy] = useState("");
    const [generated, setGenerated] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [videoUrl, setVideoUrl] = useState(null);

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
        setIsLoading(true);
        const data = {
            videoQuery: queryy
        }
        const req = await query("http://localhost:8000/api/pexels/videoSearch", { method: "post", data: data });

        if (!req?.videos) {
            let t = setTimeout(() => {
                setIsLoading(false);
                clearTimeout(t);
            }, 8000)
            return;
        }

        if (req?.videos) {
            setGenerated(req);
            setIsLoading(false);
            clearInput(queryy, setQueryy)
        }

    }

    useEffect(() => {
        const submitOnEnter = (e) => {
            if (e.key == "Enter") {
                submitQuery();
            }
            else {
                return;
            }
        }

        if (typeof window != "undefined") {
            window.addEventListener("keydown", submitOnEnter);
            return () => removeEventListener("keydown", submitOnEnter);
        }

    }, [queryy])

    const getSelVideo = useCallback((url) => {
        setVideoUrl(url);
    }, []);


    return (
        <>
            <Flex direction={"row"} justifyContent={"flex-start"} overflow="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
                <Sidebar userId={user?.id} />
                <Flex direction={"column"} alignItems={"center"} width={"80%"}>
                    <SettingsBar ProfileImage={imageRender(image)} />
                    <Box w="100%"
                        h={"85vh"}
                        position
                        padding={"1rem 2rem"}
                        display={"flex"}
                        shadow={"md"}
                        minH={"85vh"}
                        maxH={"85vh"}
                        flexDirection={"row"}
                        alignItems={"start"}
                        rowGap={10}
                        bg={"blackAlpha.800"}
                        borderRadius={12}
                        color={'white'}
                        overflowY="hidden"
                    >
                        <Box w="100%"
                            position
                            padding={"1rem 2rem"}
                            display={"flex"}
                            minH={"80vh"}
                            flexDirection={"column"}
                            alignItems={"start"}
                            rowGap={10}
                            zIndex={150}
                        >
                            <Box className={styles.videoContainer}>

                                <video
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",

                                    }}
                                    src={videoUrl} autoPlay={true} controls  >

                                </video>

                            </Box>
                            <CustomInput label={"Describe your video"} paddingY={5} gap={5} value={queryy} w={"50%"} setValue={setQueryy} />
                            <Button bg={"green.600"}
                                _hover={{ bg: "green.300" }}
                                onClick={submitQuery}
                                isLoading={isLoading}
                            >Generate</Button>
                        </Box>

                        <Box display="flex" flexDirection="column" zIndex={30000} w="50%" maxHeight="80%" minHeight="70%" overflowY="scroll" className={styles.hiddenScroll} >
                            {
                                generated?.videos?.map((vid, index) =>
                                    <VideoElement key={index} keyItem={index} width="80%"
                                        height="30px"
                                        image={vid?.image}
                                        url={vid?.video_files[0]?.link}
                                        duration={vid?.duration}
                                        setSelVideo={getSelVideo}
                                    />
                                )
                            }
                        </Box>
                    </Box>

                </Flex>
            </Flex>
        </>
    );

}