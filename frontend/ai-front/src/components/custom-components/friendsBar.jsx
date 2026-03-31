import { Box, Input } from "@chakra-ui/react";
import { Stack, HStack, VStack, Text, FormControl, FormLabel } from '@chakra-ui/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUserGroup, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./components.module.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import { query } from "@/hooks/fetch";
import { motion } from "framer-motion";
import FriendAvatar from "./FriendAvatar";


function FriendsBar({ open, setOpen, children, friendsData, user, friendRequests }) {
    if (!open) return;

    const [friendsMode, setFriendsMode] = useState("display_friends"); // state for showing specific tabs with the a default
    const [searchAddFriend, setSearchAddFriend] = useState(""); //state for input in addfriend tab
    const [profilesFound, setProfilesFound] = useState(null); //  results of searching of addfriends input
    const [searchFriend, setSearchFriend] = useState(""); //state for input of search friend tab

    // friends state
    const [friends, setFriends] = useState();
    //requests state
    const [requests, setRequests] = useState();


    useEffect(() => {
        if (!open) return;
        setRequests(friendRequests)
        setFriends(friendsData);

    }, [friendRequests, friendsData]);

    const getItemToPop = useCallback((id) => {
        const index = profilesFound.findIndex(p => p.id === id);
        let new_profiles = Array.from(profilesFound);
        new_profiles.splice(index, 1);
        setProfilesFound(new_profiles);
    }, [profilesFound, searchAddFriend,]);

    const popRequest = useCallback((id) => {
        const index = requests?.findIndex(p => p.id === id);
        let new_requests = Array.from(requests);
        new_requests.splice(index, 1);
        setRequests(new_requests);
    }, [requests])

    const popFriend = useCallback((id) => {
        const index = friends?.findIndex(p => p.id === id);
        let new_friends = Array.from(friends);
        new_friends.splice(index, 1);
        setFriends(new_friends);
    })

    const filteredFriends = useMemo(() => {
        if (searchFriend == "") return [];
        let query = searchFriend;
        return friends?.filter(f => f?.nickname?.toLowerCase().includes(query));
    }, [friends, searchFriend]); // val to filter the friends we already have

    const filteredSearch = useMemo(() => {
        if (searchAddFriend == "") return [];
        let query = searchAddFriend;
        console.log(query);
        return profilesFound?.filter(f => f?.nickname?.toLowerCase().includes(query));
    }, [profilesFound, searchAddFriend, getItemToPop]); //val for searching friends to add

    const activeFriends = useMemo(() => {
        return friends?.filter(f => f.status_activity == "online")
    }, [friends]);



    useEffect(() => {
        console.log("filtred:", filteredFriends)
    }, [filteredFriends])

    const searchFriendtoAdd = useCallback(async () => {
        const data =
        {
            username: searchAddFriend
        }
        try {
            const res = await query("http://localhost:8000/api/profile/searchProfiles", { data: data, method: "post" });
            if (res) {
                setProfilesFound(res?.profiles)
                console.log(res?.profiles)
            }
        }
        catch (e) {
            console.error("ERROR:", e)
        }
    }, [searchAddFriend]) // function to search friend to add him , its gonna fetch the data to display later in a pool

    useEffect(() => {
        if (searchAddFriend == "") return;
        else {
            let r = setTimeout(() => {
                searchFriendtoAdd();
            }, 1500);
            return () => clearTimeout(r); //some debouncing :p

        }
    }, [searchAddFriend, searchFriendtoAdd]);

    const [activeId, setActiveId] = useState(null);

    const getActiveId = useCallback((id) => {
        setActiveId(id);
    }, [activeId, setActiveId])

    return (
        <Box id="FriendsBar" width="400px" height="100vh"
            position="fixed" background={"blackAlpha.500"}
            top="0" right="0"
        >
            <VStack gap="0px" width="full" height="full" alignItems={"start"} >
                <Box className={styles.iconAndActionWrapper}>
                    <Box className={styles.iconBar}>
                        <FontAwesomeIcon
                            onClick={() => setFriendsMode("search_friend")}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            icon={faMagnifyingGlass} width={"20px"} height="20px" cursor="pointer" color="gray"
                            style={{
                                padding: "0.3rem",
                                backgroundColor: friendsMode == "search_friend" ? "rgba(0,0,0,0.2" : "transparent",
                                borderRadius: "6px"
                            }} />
                        <FontAwesomeIcon
                            onClick={() => setFriendsMode("display_friends")}
                            icon={faUserGroup} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            width={"20px"} height="20px" cursor="pointer" color="gray"
                            style={{
                                padding: "0.3rem",
                                backgroundColor: friendsMode?.includes("display_friends") ? "rgba(0,0,0,0.2" : "inherit",
                                borderRadius: "6px"
                            }} />
                        <FontAwesomeIcon
                            onClick={() => setFriendsMode("add_friend")}
                            icon={faPlus} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            width={"20px"} height="20px" cursor="pointer" color="gray"
                            style={{
                                padding: "0.3rem",
                                backgroundColor: friendsMode == "add_friend" ? "rgba(0,0,0,0.2" : "transparent",
                                borderRadius: "6px"
                            }} />
                    </Box>
                    <Box className={styles.actionFriendsRow}>
                        {
                            friendsMode?.includes("display_friends") ?
                                (
                                    <Box className={styles.displayFriendsWrapper}>
                                        <Text color={"white"} backgroundColor={"gray.800"}
                                            padding="0.5rem" borderRadius={"12px"}
                                            cursor={"pointer"}
                                            _hover={{ backgroundColor: "gray.700" }}
                                            onClick={() => setFriendsMode("display_friends")}
                                            style={{
                                                backgroundColor: friendsMode == "display_friends" ? "rgba(0,0,0,0.2" : "transparent",
                                            }}
                                        >
                                            Friends
                                        </Text>
                                        <Text color={"white"} backgroundColor={"gray.800"}
                                            padding="0.5rem" borderRadius={"12px"}
                                            cursor="pointer"
                                            _hover={{ backgroundColor: "gray.700" }}
                                            onClick={() => setFriendsMode("display_friends-requests_view")}
                                            style={{
                                                backgroundColor: friendsMode == "display_friends-requests_view" ? "rgba(0,0,0,0.2" : "transparent",
                                            }}
                                        >
                                            Pending Requests
                                        </Text>
                                    </Box>
                                ) :
                                friendsMode == "search_friend" ?
                                    (
                                        <Box className={styles.searchFriendsWrapper}>
                                            <FormControl>
                                                <FormLabel color="white">Search</FormLabel>
                                                <Input value={searchFriend} onChange={(e) => setSearchFriend(e.target.value)}
                                                    type="search" placeholder="Search friends" color="white" />
                                            </FormControl>
                                        </Box>
                                    )
                                    : friendsMode == "add_friend" ?
                                        (
                                            <Box className={styles.addFriendWrapper}>
                                                <FormControl>
                                                    <FormLabel color="white">Add friend</FormLabel>
                                                    <Input value={searchAddFriend} onChange={(e) => setSearchAddFriend(e.target.value)} type="search" placeholder="Add new friend" color="white" />
                                                </FormControl>
                                            </Box>
                                        ) : null
                        }
                    </Box>
                </Box>
                <Box className={styles.friendsPool}>
                    {/* <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}

                    > */}
                    {
                        friendsMode == "add_friend" ?
                            filteredSearch?.map(friend =>
                            (
                                <FriendAvatar
                                    id={friend?.id}
                                    key={friend?.id}
                                    user_id={user?.id}
                                    friend_id={friend?.user_id}
                                    imgSrc={friend?.image_profile}
                                    nickName={friend?.nickname}
                                    status={friend.status}
                                    forAdding={friendsMode == "add_friend" ? true : false}
                                    view={friendsMode == "search_friend" ? true : false}
                                    popItem={getItemToPop}
                                />
                            ))
                            :
                            friendsMode == "search_friend" ?
                                filteredFriends?.map(friend =>
                                (
                                    <FriendAvatar
                                        id={friend?.id}
                                        key={friend?.id}
                                        user_id={user?.id}
                                        friend_id={friend?.user_id}
                                        imgSrc={friend?.image_profile}
                                        nickName={friend?.nickname}
                                        status={friend?.status_activity}
                                        forAdding={friendsMode == "add_friend" ? true : false}
                                        view={friendsMode == "search_friend" || friendsMode == "display_friends" ? true : false}
                                        popItem={popFriend}
                                    />
                                ))
                                :
                                friendsMode == "display_friends" ?
                                    activeFriends?.map(friend =>
                                    (
                                        <FriendAvatar
                                            id={friend?.id}
                                            key={friend?.id}
                                            user_id={user?.id}
                                            friend_id={friend?.user_id}
                                            imgSrc={friend?.image_profile}
                                            nickName={friend?.nickname}
                                            status={friend?.status_activity}
                                            forAdding={friendsMode == "add_friend" ? true : false}
                                            view={friendsMode == "search_friend" || friendsMode == "display_friends" ? true : false}
                                            activeId={activeId}
                                            setActiveId={getActiveId}
                                            popItem={popFriend}
                                        />
                                    )
                                    )
                                    :
                                    requests?.map(friend =>
                                    (
                                        <FriendAvatar
                                            id={friend?.id}
                                            key={friend?.id}
                                            user_id={user?.id}
                                            imgSrc={friend?.image_profile}
                                            nickName={friend?.nickname}
                                            forAdding={false}
                                            view={false}
                                            isRequest={true}
                                            popItem={popRequest}
                                        />
                                    )
                                    )

                    }
                    {/* </motion.div> */}
                </Box>
            </VStack>
        </Box>
    )
}

export default FriendsBar;