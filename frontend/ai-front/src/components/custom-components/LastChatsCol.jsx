import { Box, Text } from "@chakra-ui/react";
import CustomAvatar from "./avatar";
import { useState, useEffect, useMemo } from "react";

export default function LastChatsCol({ setFriendId, last_profiles }) {

    const imageRender = (src) => {
        if (src?.startsWith("/storage")) {
            return `http://localhost:8000${src}`;
        }
        else {
            return src;
        }
    }

    const limitedProfiles = useMemo(() => { return last_profiles }, [last_profiles])// the state that gonna hold the profiles fetched from local storage



    const getFriendId = (friend_id) => {
        setFriendId(friend_id)
    }

    return (
        <Box display="flex" flexDirection={"column"} rowGap={"1rem"} w="90%" h="500px"
        >
            {
                limitedProfiles.map(prof =>
                (
                    <Box cursor="pointer" key={prof.id} display="flex" borderRadius={"7px"}
                        onClick={() => getFriendId(prof.friend_id)} bgColor={"whiteAlpha.500"} h="2rem">
                        <Box w="30%" display="flex" alignItems="center" justifyContent="center">
                            <CustomAvatar src={imageRender(prof?.image_profile)} noScale w="1rem" h="1rem" />
                        </Box>
                        <Box w="70%" display="flex" alignItems="center">
                            <Text color="green.600" fontSize="14px" fontWeight={"bold"} >
                                {
                                    prof?.nickname
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