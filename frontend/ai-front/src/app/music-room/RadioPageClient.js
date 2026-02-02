"use client";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import SettingsBar from "@/components/partials/settingsBar";
import { useState, useEffect, useCallback } from "react";
import { query } from "@/hooks/fetch";
import { Box, Text, Flex, Card, VStack, Divider, Button, filter } from "@chakra-ui/react";
import styles from "@/components/custom-components/components.module.css";
import CustomSelect from "@/components/custom-components/CustomSelect";
import RadioElement from "@/components/custom-components/RadioElement";


export default function RadioPageClient({ initialCountries, initialTags }) {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [generated, setGenerated] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [countries, setCountries] = useState(initialCountries);
    const [tags, setTags] = useState(initialTags);

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
        setIsLoading(true)
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
                setIsLoading(false);
            }
            else {
                let t = setTimeout(() => {
                    setIsLoading(false);
                    clearTimeout(t);
                }, 7000)
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
                setIsLoading(false);
            }
            else {
                let t = setTimeout(() => {
                    setIsLoading(false);
                    clearTimeout(t);
                }, 7000)
            }
        }

    }

    return (
        <>
            <Flex direction={"row"} justifyContent={"flex-start"} alignItems={"flex-start"} gap={20} height="100vh" w="100%" position="fixed"  >
                <Sidebar userId={user?.id} />
                <Flex direction={"column"} alignItems={"center"} width={"60%"}>
                    <SettingsBar ProfileImage={imageRender(image)} />
                    <Box w="100%"
                        position
                        padding={4}
                        display={"flex"}
                        shadow={"md"}
                        minH={"85vh"}
                        maxH={"85vh"}
                        h={"85vh"}
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
                                    isLoading={isLoading}
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
                                        setValue={(station) => setSelStation({ url: station.url_resolved, name: station.name })}
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
