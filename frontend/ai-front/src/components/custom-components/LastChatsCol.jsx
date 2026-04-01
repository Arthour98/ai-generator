import { Box, Text } from "@chakra-ui/react";
import CustomAvatar from "./avatar";
import { useState, useEffect, useMemo } from "react";

export default function LastChatsCol({ setFriendId, last_profiles }) {

    const imageRender = (src) => {
        if (src.startsWith("/storage")) {
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
        <Box display="flex" flexDirection={"column"} w="70%" h="100px"
        >
            {
                limitedProfiles.map(prof =>
                (
                    <Box display="flex" onClick={() => getFriendId(friend_id)}>
                        <Box w="50%">
                            <CustomAvatar src={imageRender(prof?.image_profile)} noScale w="1rem" h="1rem" />
                        </Box>
                        <Box w="50%">
                            <Text color="green.600" fontSize="14px" fontWeight={"bold"} />
                        </Box>
                    </Box>
                )
                )
            }
        </Box>
    )
}