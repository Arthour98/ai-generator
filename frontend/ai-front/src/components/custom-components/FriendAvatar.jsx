import { useState } from "react";
import CustomAvatar from "./avatar";
import { Box, Text, Button } from "@chakra-ui/react";
import styles from "@/components/custom-components/components.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { query } from "@/hooks/fetch";

export default function FriendAvatar({ user_id, friend_id, imgSrc, nickName, status, forAdding, view }) {

    const [scale, setScale] = useState(1);

    const imageRender = (src) => {
        if (src?.startsWith("/storage")) {
            return `http://localhost:8000${src}`;
        }
        else {
            return src;
        }
    }

    const sendInvite = async () => {
        const data =
        {
            user_id: user_id,
            invite_id: friend_id
        }
        try {
            const res = query("/api/chat/send-friend-request", { data: data, method: "post" });
            if (res) {
                console.log("friend request send")
            }
        }
        catch (e) {
            console.error("ERROR IN REQUEST", e);
        }
    }

    return (
        <Box display="flex" height="40px" borderRadius="12px" width="300px"
            dropShadow="dark-lg" backgroundColor="gray.900"
            onMouseEnter={() => setScale(1.3)}
            onMouseLeave={() => setScale(1)}
            transition="scale 0.4s linear"
            onClick={forAdding ? () => sendInvite() : view ? () => openMessageDialog() : undefined}
            scale={scale}
            boxShadow="0 0 10px var(--chakra-colors-green-400)"
        >
            <Box className={styles.friendImageCol}>
                <CustomAvatar src={imageRender(imgSrc)} shape="circle" noScale w="25px" h='25px' />
            </Box>
            <Box className={styles.friendNameCol}>
                <Text
                    color="white" fontWeight={"600"}
                    textShadow="1px 2px 0 var(--chakra-colors-green-300),
                    -1px 2px 0 var(--chakra-colors-green-300),
                     1px -2px 0 var(--chakra-colors-green-300),
                     -1px -2px 0 var(--chakra-colors-green-300)" >
                    {nickName}
                </Text>
            </Box>
            <Box className={styles.friendActionsCol}>
                {
                    forAdding &&
                    (
                        <Box display="flex" columnGap="1rem">
                            <Button fontSize={"11px"} color="white" bg="gray.700" h="16px" p="10px 5px"
                                boxShadow="0 0 10px var(--chakra-colors-green-400)"
                                _hover={{ bg: "green.500", color: "black" }}
                            >Add friend</Button>
                            <Button color="white" bg="transparent" h="16px" minW="8px" p="10px 2px" fontSize="11px"
                                _hover={{ bg: "green.500", color: "black" }}
                            >X</Button>
                        </Box>
                    )
                }
                {
                    view &&
                    (
                        <Box display="flex" width="50%">
                            <FontAwesomeIcon icon={faMessage} size={"12px"} />
                            <Text color={status == "online" ? "green.600" : "red.600"}>
                                {status == "online" ? "Online" : "Offline"}
                            </Text>
                        </Box>
                    )
                }
            </Box>
        </Box >
    )


}