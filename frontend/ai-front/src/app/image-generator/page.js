"use client";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import SettingsBar from "@/components/partials/settingsBar";
import { useState, useEffect, useCallback, useEffectEvent } from "react";
import { query } from "@/hooks/fetch";
import { Box, Text, Flex, Card, VStack, Divider, Button, filter } from "@chakra-ui/react";
import CustomInput from "@/components/custom-components/customInput";
import styles from "@/components/custom-components/components.module.css";
import { Image } from "@chakra-ui/react";
import CustomSkeleton from "@/components/custom-components/skeleton";
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faCircleArrowRight, faFileExport } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@/components/custom-components/CustomTooltip"
import DownloadItem from "@/utils/downloadItem";
import { clearInput } from "@/utils/clearInput";


export default function ImageGeneratorPage() {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [profile, setProfile] = useState();
    const [queryy, setQueryy] = useState("");
    const [generated, setGenerated] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    //animations
    const [scale, setScale] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [scale2, setScale2] = useState(1);
    const [opacity2, setOpacity2] = useState(1);

    //imageIndex
    const [imgIndex, setImageIndex] = useState(0);

    //tooltip
    const [showTooltip, setShowTooltip] = useState(false);

    //loader for request (button)
    const [loaderQuery, setLoaderQuery] = useState(false);

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
        setLoaderQuery(true);
        const data = {
            query: queryy
        }
        try {
            const req = await query("http://localhost:8000/api/pixabay/search", { method: "post", data: data });
            if (req?.hits) {
                setLoaderQuery(false);
            }
            setGenerated(req.hits);
            setImageIndex(0); //reset the index on call
            clearInput(queryy, setQueryy);
        }
        catch (e) {
            setLoaderQuery(false);
        }

    }

    const enterQuery = useCallback((e) => {
        if (e.key == "Enter") {
            submitQuery();
        }
    }, [queryy])

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("keydown", enterQuery)
            return () => window.removeEventListener("keydown", enterQuery)
        }
    }, [queryy])

    const growLeft = () => {
        setScale(1.5);
        setOpacity(0.7);
    }
    const shrinkLeft = () => {
        setScale(1);
        setOpacity(1);
    }
    const growRight = () => {
        setScale2(1.5);
        setOpacity2(0.7);
    }
    const shrinkRight = () => {
        setScale2(1);
        setOpacity2(1);
    }

    const nextImage = useCallback(() => {
        setImageIndex((index) => {
            let newIndex = index + 1;
            index > generated?.length - 2 ? newIndex = 0 : newIndex;
            return newIndex
        })
    }, [imgIndex])

    const prevImage = useCallback(() => {
        setImageIndex((index) => {
            let newIndex = index - 1;
            index <= 0 ? newIndex = generated?.length - 1 : newIndex
            return newIndex;
        })
    }, [imgIndex])

    useEffect(() => {
        if (generated && generated.length > 0) {
            setImageUrl(generated[imgIndex]?.largeImageURL)
        }
        else {
            return;
        }
    }, [imgIndex, generated])


    return (
        <>
            <Flex direction={{ base: "column", lg: "row" }} justifyContent={"flex-start"} overflowY="hidden"
                alignItems={"flex-start"} gap={{ base: 2, lg: 20 }} height={{ base: "auto", lg: "100vh" }}
            >
                <Sidebar userId={user?.id} />
                <Flex direction={"column"} alignItems={"center"} width={{ base: "100%", lg: "60%" }} p={2   }
                    rowGap={{ base: "20px", lg: "20px" }}>
                    <SettingsBar ProfileImage={imageRender(image)} />
                    <Box w={{ base: "90%", lg: "100%" }}
                        padding={{ base: 6, lg: 4 }}
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
                        <Box className={styles.imageContainer}>
                            {/*leftarrow */}
                            {imageUrl ?
                                <FontAwesomeIcon color={"cyan"}
                                    icon={faCircleArrowLeft}
                                    size={"xl"}
                                    cursor={"pointer"}
                                    onMouseOver={growLeft}
                                    onMouseLeave={shrinkLeft}
                                    style={{
                                        transform: `scale(${scale})`,
                                        transition: 'transform 0.5s, opacity 0.5s',
                                    }}
                                    opacity={opacity}
                                    onClick={prevImage}
                                />
                                :
                                null
                            }
                            {!isLoading ?
                                <Box w={"auto"}
                                    h={"auto"}
                                    overflow={"hidden"}
                                    borderRadius={12}
                                    position="relative"
                                >
                                    <Image width={{ base: "280px", sm: "350px", md: "450px", lg: "500px" }}
                                        height={{ base: "220px", sm: "280px", md: "360px", lg: "400px" }}
                                        src={imageUrl}
                                        bordeRadius={'12px'}
                                    />
                                    <Box className={styles.downloadTooltip}>
                                        <Tooltip portaled showArrow content="Click to download this image">
                                            <DownloadItem data={imageUrl} fileName={`image/`}>
                                                <FontAwesomeIcon icon={faFileExport}
                                                    style={{
                                                        filter: `brightness(1) `,
                                                        cursor: "pointer",
                                                        background: "rgba(0,0,0,0.5)",
                                                        padding: "0.5rem",
                                                        borderRadius: "12px"
                                                    }}
                                                    size={"xl"}
                                                />
                                            </DownloadItem>
                                        </Tooltip>
                                    </Box>
                                </Box>
                                :
                                <CustomSkeleton
                                    w={{ base: '280px', sm: '350px', md: '450px', lg: '500px' }}
                                    h={{ base: '220px', sm: '280px', md: '360px', lg: '400px' }}
                                    borderRadius={'12px'}
                                    loading={isLoading}
                                />}

                            {imageUrl ?
                                <FontAwesomeIcon icon={faCircleArrowRight}
                                    color={'cyan'}
                                    size={"xl"}
                                    cursor={"pointer"}
                                    onMouseOver={growRight}
                                    onMouseLeave={shrinkRight}
                                    style={{
                                        transform: `scale(${scale2})`,
                                        transition: 'transform 0.5s, opacity 0.5s',
                                    }}
                                    opacity={opacity2}
                                    onClick={nextImage}
                                />
                                :
                                null
                            }
                        </Box>
                        <CustomInput label={"Describe your image"} paddingY={5} gap={5} value={queryy} w={{ base: "90%", md: "70%", lg: "60%" }} setValue={setQueryy} />
                        <Button bg={"green.600"}
                            _hover={{ bg: "green.300" }}
                            onClick={submitQuery}
                            isLoading={loaderQuery}
                        >Generate</Button>
                    </Box>

                </Flex>
            </Flex>
        </>
    );

}
