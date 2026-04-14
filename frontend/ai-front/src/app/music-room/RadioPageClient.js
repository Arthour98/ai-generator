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
import Motion from "@/components/custom-components/motion";
import { imageRender } from "@/utils/imageRender";


export default function RadioPageClient({ initialCountries, initialTags }) {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [countries, setCountries] = useState(initialCountries);
    const [tags, setTags] = useState(initialTags);

    const [selCountry, setSelCountry] = useState("");
    const [selTag, setSelTag] = useState("");

    const [stations, setStations] = useState([]);

    const [selStation, setSelStation] = useState({});

    const [hasStations, setHasStations] = useState(false);


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


    const getProfile = async () => {
        const userId = user?.id;
        const data = {
            user_id: userId
        }
        const res = await query("/api/profile", { params: data })

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
            const req = await query(`/api/radio/country/sel`, { method: "post", data: data });
            if (req) {

                let stations = req?.data;
                let filteredStations = stations.filter(
                    (obj, index, self) =>
                        index === self.findIndex(o => o.name === obj.name))

                setStations(filteredStations);
                setSelStation(stations[0]);
                setHasStations(true);
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
            const req = await query('/api/radio/tag/sel', { method: "post", data: data })
            if (req) {
                let stations = req?.data;
                let filteredStations = stations.filter(
                    (obj, index, self) =>
                        index === self.findIndex(o => o.name === obj.name))
                setStations(filteredStations);
                setSelStation(stations[0])
                setHasStations(true);
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
            <Flex direction={{ base: "column", lg: "row" }} justifyContent={"flex-start"} overflowY="hidden"
                alignItems={"flex-start"} gap={{ base: 2, lg: 20 }} height={{ base: "140vh", lg: "100vh" }} p={{ base: 2, lg: 0 }}>
                <Sidebar userId={user?.id} />
                <Flex direction={"column"} alignItems={"center"} width={{ base: "100%", lg: "60%" }}
                    rowGap={{ base: "20px", lg: "20px" }}>
                    <Flex direction={"column"} alignItems={"center"} h="100%" width={{ base: "100%", lg: "100%" }}>
                        <SettingsBar ProfileImage={imageRender(image)} />
                        <Box w="100%"
                            position
                            padding={4}
                            display={"flex"}
                            shadow={"md"}
                            minH={{ base: "90vh", lg: "85vh" }}
                            maxH={{ base: "90vh", lg: "85vh" }}
                            h={{ base: "90vh", lg: "85vh" }}
                            flexDirection={"column"}
                            alignItems={"start"}
                            rowGap={{ base: 3, lg: 10 }}
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
                                        w={{ base: "100%", lg: "80%" }}
                                        h={{ base: "100%", lg: "100%" }}
                                        setIndex={getAndHandleIndex}
                                    />


                                    <Flex direction={"column"} rowGap={"5px"}>
                                        <Motion
                                            open={hasStations}>
                                            <Text>Choose station</Text>
                                            <CustomSelect
                                                w="50%"
                                                data={stations}
                                                name="name"
                                                setValue={(station) => setSelStation({ url: station.url_resolved, name: station.name })}
                                                placeholder="Select station"
                                                value={selStation?.name}
                                            />
                                        </Motion>
                                    </Flex>


                                </Box>


                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </Flex >
        </>
    );

}
