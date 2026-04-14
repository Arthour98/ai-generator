import { Box, Text } from "@chakra-ui/react";
import CustomAvatar from "./avatar";
import { useState, useEffect, useMemo } from "react";
import { nameShortener } from "@/utils/nameShortener";
import { imageRender } from "@/utils/imageRender";


export default function LastChatsCol({ setFriendId, last_profiles, mobile }) {
    const limitedProfiles = useMemo(() => { return last_profiles }, [last_profiles])// the state that gonna hold the profiles fetched from local storage


    const getFriendId = (friend_id) => {
        setFriendId(friend_id)
    }

    return (
        <Box display="flex" flexDirection={{ base: "row", md: "row", lg: "column" }}
            rowGap={"1rem"} w={{ base: '100%', md: "100%" }} px={{ base: 2, md: 4 }} h={{ base: "10%", md: "10%", lg: "400px" }}
            columnGap={{ base: "10px", lg: "0" }}
        >
            {
                limitedProfiles.map(prof =>
                (
                    <Box cursor="pointer" key={prof.id} display="flex" borderRadius={"7px"}
                        onClick={() => getFriendId(prof.friend_id)} bgColor={"whiteAlpha.500"}
                        h="2rem" flexShrink={{ base: "0", md: "1" }} w={{ base: "30%", md: "90%", lg: "100%" }}
                    >
                        <Box w="30%" display="flex" alignItems="center" justifyContent="center">
                            <CustomAvatar src={imageRender(prof?.image_profile)} noScale w="1rem" h="1rem" />
                        </Box>
                        <Box w="70%" display="flex" alignItems="center">
                            <Text color="green.600" fontSize="14px" fontWeight={"bold"} >
                                {
                                    mobile ? nameShortener(prof?.nickname, 7) : nameShortener(prof?.nickname)
                                }
                            </Text>
                        </Box>
                    </Box>
                )
                )
            }
        </Box >
    )
}