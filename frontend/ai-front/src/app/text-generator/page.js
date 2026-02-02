"use client";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import SettingsBar from "@/components/partials/settingsBar";
import { useState, useEffect, useCallback, useRef } from "react";
import { query } from "@/hooks/fetch";
import { Box, Text, Flex, Card, VStack, Divider, Button, filter } from "@chakra-ui/react";
import CustomInput from "@/components/custom-components/customInput";
import styles from "@/components/custom-components/components.module.css";
import { Image } from "@chakra-ui/react";
import CustomSkeleton from "@/components/custom-components/skeleton";
import { clearInput } from "@/utils/clearInput";




export default function TextPage() {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [profile, setProfile] = useState();
    const [queryy, setQueryy] = useState("");
    const [generated, setGenerated] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const [aiText, setAiText] = useState(null);
    const [prevText, setPrevText] = useState([]);

    const [loading, setLoading] = useState(false);

    const textRef = useRef(null); //ref for every text , so we can scoll into the last aiText created

    const bullets = new Array(4).fill(".")
    const [bulletScale, setBulletScale] = useState([0.5, 0.5, 0.5, 0.5]);
    const [bulletOpacity, setBulletOpacity] = useState([0.3, 0.3, 0.3, 0.3]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [displayBullets, setDisplayBullets] = useState(false);
    const bulletContainer = useRef(null);

    useEffect(() => {
        const container = bulletContainer?.current;
        if (!displayBullets) return;
        // Scroll within the parent container, not the page
        const parentContainer = container?.closest('[role="region"]') || container?.parentElement?.parentElement;
        if (parentContainer) {
            parentContainer.scrollTop = parentContainer.scrollHeight;
        }
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % 5); //use bigger length by one bicause indexing starting with +1 so last element will always exclude
        }, 200);
        return () => clearInterval(interval);
    }, [displayBullets]);

    useEffect(() => {
        if (!displayBullets) return
        const newScale = Array.from(bulletScale)
        const newOpacity = Array.from(bulletOpacity);

        newScale[activeIndex] = 1.5;
        newOpacity[activeIndex] = 1;

        if (activeIndex > 0) {
            newScale[activeIndex - 1] = 0.75;
            newOpacity[activeIndex - 1] = 0.6;
        }
        setBulletScale(newScale);
        setBulletOpacity(newOpacity);
    }, [activeIndex, displayBullets]) //bullets animation functionality


    useEffect(() => {
        let history = JSON.parse(localStorage.getItem("history"));
        setPrevText(history ?? []);
    }, []); //history fetcher effect

    useEffect(() => {
        if (!prevText || prevText.length === 0) return;
        const textContainer = document.querySelector('[class*="textContainer"]');
        if (textContainer) {
            textContainer.scrollTop = textContainer.scrollHeight;
        }
    }, [prevText]) //scrolling to last text effect

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
        setDisplayBullets(true)
        setLoading(true);
        const data = {
            prompt: queryy,

        }
        const req = await query("http://localhost:8000/api/ai/text", { method: "post", data: data });
        const answear = req?.answer?.candidates[0]?.content?.parts[0]?.text;

        if (!answear) {
            console.error("AI response invalid:", req);
            return;
        }
        if (!answear) {
            let t = setTimeout(() => {
                setLoading(false);
                setDisplayBullets(false)
                clearTimeout(t);
            }, 8000)
        }
        else {
            setLoading(false)
            setDisplayBullets(false)
        }

        const question = queryy;
        const formatedData =
        {
            question: question,
            answear: answear
        }
        setGenerated(formatedData);
        clearInput(queryy, setQueryy);
    }

    const submitOnEnter = (e) => {
        if (e.key == "Enter") {
            submitQuery();
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener('keydown', submitOnEnter)
            return () => window.removeEventListener('keydown', submitOnEnter)
        }
    }, [queryy]);

    useEffect(() => {
        if (!generated) return;
        setAiText(generated)
        const oldHistory = JSON.parse(localStorage.getItem("history")) ?? [];
        const newHistory = [...oldHistory, generated];
        localStorage.setItem("history", JSON.stringify(newHistory));
    }, [generated]);

    useEffect(() => {
        if (prevText) {
            const oldhistory = JSON.parse(localStorage.getItem("history")) ?? [];
            setPrevText([...oldhistory]);
        }

    }, [aiText])

    const clearHistory = () => {
        setAiText(null);
        setPrevText([])
        setQueryy("");
        setGenerated(null);
        localStorage.removeItem("history");
    }



    return (
        <>
            <Flex direction={"row"} justifyContent={"flex-start"} overflow="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
                <Sidebar userId={user?.id} />
                <Flex direction={"column"} alignItems={"center"} width={"60%"}>
                    <SettingsBar ProfileImage={imageRender(image)} />
                    <Box w="100%"
                        h={"85vh"}
                        position="relative"
                        padding={4}
                        display={"flex"}
                        shadow={"md"}
                        minH={"85vh"}
                        maxH={"85vh"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        rowGap={10}
                        bg={"blackAlpha.800"}
                        borderRadius={12}
                        color={'white'}
                    >
                        <Box className={styles.textContainer}>
                            {Array.isArray(prevText) && prevText.length > 0 &&
                                prevText.map((prev, index) => (
                                    <Box key={index}>
                                        <Box
                                            className={styles.textAiStyle}
                                            ref={(t) => textRef[index] = t} >
                                            <Text decoration="underline" lineHeight={"40px"} >
                                                {
                                                    prev?.question
                                                }
                                            </Text>
                                            <Text paddingLeft={"1rem"} >
                                                {
                                                    prev?.answear
                                                }
                                            </Text>
                                        </Box>
                                        <Divider orientation="horizontal" />
                                    </Box>
                                ))
                            }
                            <Box padding="10px 0" ref={bulletContainer}>
                                {
                                    bullets.map((bullet, index) => (
                                        displayBullets ?
                                            <span key={index}
                                                style=
                                                {{
                                                    width: "8px",
                                                    height: "8px",
                                                    backgroundColor: "white",
                                                    borderRadius: "50%",
                                                    display: "inline-block",
                                                    marginRight: "8px",
                                                    transform: `scale(${bulletScale[index]})`,
                                                    opacity: bulletOpacity[index],
                                                    transition: 'all 0.2s ease-in-out'
                                                }}>
                                            </span>
                                            :
                                            null
                                    ))
                                }
                            </Box>


                        </Box>
                        {prevText?.length > 0 ?
                            <Button bg={"cyan.600"}
                                _hover={{ bg: "cyan.300" }}
                                onClick={clearHistory}
                                alignSelf={"end"}
                            >Clear History</Button>
                            :
                            null
                        }
                        <CustomInput label={"Ask a question "} paddingY={5} gap={5} value={queryy} w={"60%"} setValue={setQueryy} />
                        <Button bg={"green.600"}
                            _hover={{ bg: "green.300" }}
                            onClick={submitQuery}
                            isLoading={loading}
                        >Ask</Button>
                    </Box>

                </Flex>
            </Flex>
        </>
    );

}