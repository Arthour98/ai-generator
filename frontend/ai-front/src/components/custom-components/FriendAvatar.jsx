import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import CustomAvatar from "./avatar";
import { Box, Text, Button, Link } from "@chakra-ui/react";
import styles from "@/components/custom-components/components.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faCircleCheck, faXmark, faTrash, faLink } from "@fortawesome/free-solid-svg-icons";
import { query } from "@/hooks/fetch";
import { useCustomToast } from "../../hooks/CustomToast";
import { nameShortener } from "@/utils/nameShortener";

export default function FriendAvatar({ id, user_id, friend_id, imgSrc, nickName, status, forAdding = false, isSearched = false,
    view = false, isRequest = false, popItem, activeId, setActiveId, setFriendId, profile_id }) {
    //Note : on current component the data received is different from the time a user send invite to the time the user user gets the request and
    // being friends , since i have only one component and just 2 endpoints for fetching friends-request functionality , logic is quite complex
    // and needs caution , not ideal for big projects on production cause it can lead to bugs if managed by many devs that dont know the project !
    const CustomToast = useCustomToast();
    const [scale, setScale] = useState(1);

    const imageRender = (src) => {
        if (src?.startsWith("/storage")) {
            return `http://localhost:8000${src}`;
        }
        else {
            return src;
        }
    }

    const sendInvite = async (id) => {
        const data =
        {
            user_id: user_id,
            invite_id: friend_id
        }
        try {
            const res = await query("/api/chat/send-friend-request", { data: data, method: "post" });
            if (res.message === "sent") {
                CustomToast({ content: "Your invitation was sent successfully", status: "success" });
                popItem(id);
            }
            else if (res.message === "failed") {
                CustomToast({ content: "Your invitation failed", status: "error" });
                popItem(id);
            }
        }
        catch (e) {
            console.error("ERROR IN REQUEST", e);
            CustomToast({ content: "Error", status: "error" });
        }
    }

    const acceptInvite = async () => {
        const data =
        {
            user_id: user_id,
            friendship_id: id,
            accept: true
        }
        try {
            const res = await query("/api/chat/accept-friend-request", { method: "post", data: data });
            if (res.message) {
                CustomToast({ content: "You Accepted Friend Request", status: "success" });
                popItem(id);
            }
        }
        catch (e) {
            console.error("ERROR:", e);
            CustomToast({ content: "Error", status: "error" });
        }

    }

    const declineInvite = async () => {
        const data =
        {
            user_id: user_id,
            friendship_id: id,
            accept: false
        }
        try {
            const res = await query("/api/chat/accept-friend-request", { method: "post", data: data });
            if (res.message) {
                CustomToast({ content: "You Declined Friend Request", status: "success" });
                popItem(id);
            }
        }
        catch (e) {
            console.error("ERROR:", e);
            CustomToast({ content: "Error", status: "error" });
        }

    }

    const hideItem = (id) => {
        return () => popItem(id);
    }

    const [openBin, setOpenBin] = useState(false);
    //trash bin ref for getting the item node
    const trashRef = useRef();
    const trashIcon = useRef();




    const selectActiveId = useCallback((e) => {
        if (isRequest || forAdding) return;
        if (trashRef.current && trashRef.current.contains(e.target)) {
            setActiveId(id);
        }
    }, [activeId])

    useEffect(() => {
        if (activeId == id) {
            setOpenBin(true)
        }
        else {
            setOpenBin(false);
        }
    }, [activeId])

    const hideBins = (e) => {
        if (!trashRef.current?.contains(e.target)) {
            setOpenBin(false);
        }

    }

    useEffect(() => {
        console.log("YOOOOOOOO")
        if (typeof window != "undefined") {
            window.addEventListener("click", hideBins)
        }
        return () => {
            window.removeEventListener("click", hideBins)
        }
    }, [activeId])

    const [isHovering, setIsHovering] = useState(false); // hovering effect state

    const deleteFriend = async () => {
        const data =
        {
            friendship_id: id,
            user_id: user_id
        }
        try {
            const res = await query("/api/chat/delete-friend", { method: "post", data: data });
            if (res.message == "success") {
                CustomToast({ status: "success", content: "You successfuly deleted this person" })
                popItem(id);
            }
        }
        catch (e) {
            CustomToast({ status: "error", content: "There was an error deleting this person" })
        }
    }

    const getFriendId = (friend_id) => {
        setFriendId(friend_id);
    }

    const [openInfo, setOpenInfo] = useState(false);

    useEffect(() => {
        if (activeId == id) {
            setOpenInfo(true)
        }
        else {
            setOpenInfo(false);
        }
    }, [activeId])




    return (
        <Box display="flex" height="40px" borderRadius="12px" width="300px"
            dropShadow="dark-lg" backgroundColor="gray.900"
            onMouseEnter={() => { setScale(1.03); setIsHovering(true) }}
            onMouseLeave={() => { setScale(1); setIsHovering(false) }}
            transition="transform 0.2s linear, box-shadow 0.2s linear"
            // onClick={forAdding ? () => sendInvite() : view ? () => openMessageDialog() : undefined}
            transform={`scale(${scale})`}
            boxShadow={isHovering ? "0 0 15px var(--chakra-colors-green-200)" : "0 0 10px var(--chakra-colors-green-400)"}
            position="relative"
            onClick={selectActiveId}
            cursor={view || isSearched ? "pointer" : "default"}
            ref={trashRef}
        >
            {view &&

                openBin ?
                (
                    <Box
                        height="inherit" position="absolute"
                        right="105%" display="flex" alignItems={"center"}
                        opacity={openBin ? 1 : 0}
                        transition="opacity 0.2s ease"
                    >
                        <FontAwesomeIcon ref={trashIcon} cursor="pointer"
                            icon={faTrash} width="11px" height="12px" color={"red"}
                            onClick={deleteFriend}
                        />
                    </Box>
                ) : null

            }
            {
                isSearched &&
                    openInfo ?
                    (
                        <Link
                            height="inherit" position="absolute"
                            right="105%" display="flex" alignItems={"center"}
                            opacity={openBin ? 1 : 0}
                            transition="opacity 0.2s ease"
                            target="_blank"
                            href={`view-profile/${profile_id}`}
                        >
                            <FontAwesomeIcon icon={faLink} cursor="pointer"
                                width="11px" height="12px" color={"white"}
                            />
                        </Link>
                    ) : null
            }
            <Box className={styles.friendImageCol} filter="brighteness(1.3)">
                <CustomAvatar src={imageRender(imgSrc)} shape="circle" noScale w="35px" h='25px' />
            </Box>
            <Box className={styles.friendNameCol}>
                <Text
                    color="white" fontWeight={"600"}
                    textShadow="1px 1px 0 var(--chakra-colors-green-300),
                    -1px 1px 0 var(--chakra-colors-green-300),
                     1px -1px 0 var(--chakra-colors-green-300),
                     -1px -1px 0 var(--chakra-colors-green-300)" >
                    {nameShortener(nickName)}
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
                                onClick={() => sendInvite()}
                            >Add friend</Button>
                            <Button color="white" bg="transparent" h="16px" minW="8px" p="10px 2px" fontSize="11px"
                                _hover={{ bg: "green.500", color: "black" }}
                                onClick={() => hideItem(id)}
                            >X</Button>
                        </Box>
                    )
                }
                {
                    (view || isSearched) &&
                    (
                        <Box display="flex" width="100%" h="100%" justifyContent={"space-between"} alignItems="center" >
                            <Box w="50%" h="100%" display="flex" alignItems="center" justifyContent={"center"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    getFriendId(friend_id);
                                }
                                }>
                                <FontAwesomeIcon
                                    color="white" cursor="pointer" icon={faMessage} size={"12px"} />
                            </Box>
                            <Text color={status == "online" ? "green.600" : "red.600"}>
                                {status == "online" ? "Online" : "Offline"}
                            </Text>
                        </Box>
                    )
                }
                {
                    isRequest && !forAdding &&
                    (
                        <Box display="flex" columnGap={"1rem"} width="50%">
                            <FontAwesomeIcon onClick={() => acceptInvite()} cursor="pointer" color={"green"} icon={faCircleCheck} />
                            <FontAwesomeIcon onClick={() => declineInvite()} cursor='pointer' color={"red"} icon={faXmark} />
                        </Box>
                    )
                }
            </Box>
        </Box >
    )


}