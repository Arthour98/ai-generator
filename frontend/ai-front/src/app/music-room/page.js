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
import CustomSelect from "@/components/custom-components/CustomSelect";
import RadioElement from "@/components/custom-components/RadioElement";


export default function RadioPage() {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [generated, setGenerated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [countries, setCountries] = useState([]);
    const [tags, setTags] = useState([]);

    const [selCountry, setSelCountry] = useState("");
    const [selTag, setSelTag] = useState("");

    const [stations, setStations] = useState([]);

    const [selStation, setSelStation] = useState({});


    const getAndHandleIndex = useCallback((i) => {

        let currentIndex = stations.findIndex(s => s.name === selStation?.name);

        let newIndex = currentIndex;
        if (newIndex >= stations.length) {
            newIndex = 0;
        }
        else if (newIndex < 0) {
            newIndex = stations.length - 1
        }
        else {
            newIndex = currentIndex + i;
        }
        setSelStation(stations[newIndex])
    }, [stations, selStation])

    useEffect(() => {
        console.log("stations:", stations)
    }, [stations])


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
        if (selCountry !== "" && selTag === "") {
            const data = {
                country: selCountry
            }
            const req = await query(`http://localhost:8000/api/radio/country/sel`, { method: "post", data: data });
            if (req) {

                let stations = req?.data;
                let filteredStations = stations.filter(
                    (obj, index, self) =>
                        index === self.findIndex(o => o.name === obj.name))

                setStations(filteredStations);
                setSelStation(stations[0]);
            }
        }
        else if (selCountry === "" && selTag !== "") {
            const data =
            {
                tag: selTag
            }
            const req = await query('http://localhost:8000/api/radio/tag/sel', { method: "post", data: data })
            if (req) {
                let stations = req?.data;
                let filteredStations = stations.filter(
                    (obj, index, self) =>
                        index === self.findIndex(o => o.name === obj.name))
                setStations(filteredStations);
                setSelStation(stations[0])
            }
        }


    }

    const getRadios = async () => {
        const req = await Promise.all([
            query("/api/radio/countries", { withCredentials: true }),
            query("/api/radio/tags", { withCredentials: true }),
        ]);

        if (req) {
            let countries = req[0]?.countries?.slice(0, 400).map(m => m.name)
            let tags = req[1]?.tags?.slice(0, 400).map(t => t.name)
            countries.unshift("No country")
            tags.unshift("No tag")
            setCountries(countries);
            setTags(tags);
            console.log("countries", countries);
            console.log("tags", tags);
        }
    }
    useEffect(() => {
        getRadios();
    }, [])







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
                        alignItems={"start"}
                        rowGap={10}
                        bg={"blackAlpha.800"}
                        borderRadius={12}
                        color={'white'}
                    >
                        <Box className={styles.radioContainer}>
                            <Box className={styles.searchCol}>
                                <Flex direction={"column"} rowGap={"5px"}>
                                    <Text>Search by Country</Text>
                                    <CustomSelect data={countries} value={selCountry}
                                        setValue={setSelCountry} search w={"90%"}
                                    />
                                </Flex>
                                <Flex direction="column" rowGap={"5px"}>
                                    <Text>Search by Tag</Text>
                                    <CustomSelect data={tags} value={selTag} w={"90%"}
                                        setValue={setSelTag} search
                                    />
                                </Flex>
                                <Button bg={"green.600"}
                                    _hover={{ bg: "green.300" }}
                                    onClick={submitQuery}
                                    w={"50%"}
                                >
                                    Search stations
                                </Button>
                            </Box>
                            <Box className={styles.displayRadio}>
                                <RadioElement
                                    name={selStation?.name}
                                    url={selStation?.url}
                                    w={"80%"}
                                    h={"400px"}
                                    setIndex={getAndHandleIndex}
                                />
                                <Flex direction={"column"} rowGap={"5px"}>
                                    <Text>Choose station</Text>
                                    <CustomSelect
                                        w="50%"
                                        data={stations}
                                        name="name"
                                        setValue={(station) => setSelStation({ url: station.url_resolved, name: station.name })} // ✅ store selected station URL
                                        placeholder="Select station"
                                        value={selStation?.name}
                                    />
                                </Flex>
                            </Box>


                        </Box>
                    </Box>

                </Flex>
            </Flex>
        </>
    );

}