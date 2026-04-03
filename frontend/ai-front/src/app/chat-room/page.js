"use client";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import SettingsBar from "@/components/partials/settingsBar";
import { useState, useEffect, useCallback, useMemo } from "react";
import { query } from "@/hooks/fetch";
import { Box, Text, Flex, Card, VStack, Divider } from "@chakra-ui/react";
import FriendsBar from "../../components/custom-components/friendsBar";
import CustomAvatar from "@/components/custom-components/avatar";
import CustomSwitch from "@/components/custom-components/customSwtich";
import LastChatsCol from "@/components/custom-components/LastChatsCol";
import ChatMainCol from "@/components/custom-components/ChatMainCol";


export default function ChatPage() {

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [profile, setProfile] = useState();
    const [nickName, setNickname] = useState();
    const [activityStatus, setActivityStatus] = useState(false);

    // data for all friends
    const [friendsData, setFriendsData] = useState();
    const [friendRequests, setFriendRequests] = useState([]);
    const [userMessages, setUserMessages] = useState([]);

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
            const settings = res.profile?.settings;
            setProfile(profile);
            setNickname(profile.nickname);
            // setCountry(profile.country);
            setImage(profile.image_profile);
            // setBackgroundColor(settings?.background_color);
            // setTextColor(settings?.text_color);
            // setOpenMatrix(settings?.matrix);
        }
        else {
            console.log("error fetching profile");
        }
    }

    const getFriends = async () => {
        try {
            const res = await query(`/api/chat/friends/${user?.id}`, { method: "get" });
            if (res) {
                const profiles = res?.data?.filter(d => d.status == "accepted").map(d => {
                    delete d.profile.id; // do the same mapping so the componenets receiving this data wont break ;)
                    return {
                        id: d.id,
                        friend_id: d.friend_id,
                        user_id: d.user_id,
                        inviter_id: d.inviter_id,
                        ...d?.profile  // oh god i should have  created different endpoints in api , now i am suffering af :OOO
                    }
                });
                const requests = res?.data?.filter(d => d.inviter_id != user?.id && d.status == "pending").map(d => {
                    delete d.profile.id; //delete the property of profile because its taking the id of what i really want :D
                    return {
                        id: d.id,
                        friend_id: d.friend_id,
                        user_id: d.user_id,
                        inviter_id: d.inviter_id,
                        ...d?.profile //mappping data so afterwards it wont bug cause have some properties that needs to be passed
                    }
                });

                setFriendsData(profiles);
                setFriendRequests(requests)
            }
        }
        catch (e) {
            console.error("ERROR:", e);
        }
    } // need polling

    const getMessages = async () => {
        try {
            const res = await query(`/api/chat/messages/${user?.id}`, { method: "get" })
            if (res?.data) {
                let messages = res?.data[0]?.messages
                setUserMessages(messages);
            }
        }
        catch (e) {
            console.error(e);
        }
    }



    useEffect(() => {
        if (!user) return;
        getProfile();
        getFriends();
        getMessages();
    }, [user]);

    const [friendActiveId, setFriendActiveId] = useState();

    const getFriendId = useCallback((friend_id) => {
        setFriendActiveId(friend_id);
    }, [friendActiveId])

    useEffect(() => {
        console.log("Friend_id", friendActiveId)
    }, [friendActiveId])

    const [limitedProfiles, setLimitedProfiles] = useState([]);

    useEffect(() => {
        let last_profiles = JSON.parse(localStorage.getItem('last_profiles')) ?? [];
        setLimitedProfiles(last_profiles);
    }, []);


    ////////////// openChat state
    const [openChat, setOpenChat] = useState(true)

    const selFriend = useMemo(() => {
        let selectedFriend = friendsData?.filter(f => f.friend_id == friendActiveId)
        if (selectedFriend) {
            return selectedFriend[0];
        }
        else {
            return {};
        }
    }, [friendActiveId, friendsData])

    const selFriendMessages = useMemo(() => {
        // if (!selFriend || !userMessages) {
        //     return [];
        // }
        // else if 
        if (selFriend !== null && userMessages) {
            let friendMessages = userMessages?.filter(data => data?.friends_conversation == selFriend?.id);
            return friendMessages;
        }
    }, [selFriend, userMessages, friendActiveId])

    const getMessageData = useCallback((data) => {
        setUserMessages(data);
    }, [userMessages])

    useEffect(() => { // debugin
        console.log("Requests:", friendRequests);
        console.log("friends:", friendsData)
        console.log("sel_friend:", selFriend);
        console.log("user_mesages", userMessages)
        console.log("selected_messages:", selFriendMessages)
    }, [friendRequests, friendsData, selFriend, userMessages, selFriendMessages])

    return (
        <>
            <Flex direction={"row"} justifyContent={"flex-start"} overflow={"visible"} overflowY="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
                <Sidebar userId={user?.id} />
                <Flex direction={"column"} alignItems={"center"} width={"60%"}>
                    <SettingsBar ProfileImage={imageRender(image)} />
                    <Box w="100%"
                        position
                        padding={4}
                        display={"flex"}
                        shadow={"md"}
                        minH={"85vh"}
                        height={"85vh"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        rowGap={3}
                        bg={"blackAlpha.800"}
                        borderRadius={12}
                        color={'white'}
                        overflowY="hidden"
                        overflow={"visible"}
                    >
                        <Box width="100%" height="15%" display="flex" alignItems="center" gap="1rem"
                            backgroundColor="whiteAlpha.500" borderRadius="15px" padding="0.5rem 1rem">
                            <CustomAvatar src={imageRender(image)} noScale={true} />
                            <CustomSwitch value={activityStatus} setValue={() => setActivityStatus(!activityStatus)} />
                            <Box>Status:<Text color={activityStatus ? "green.800" : "red.800"}>{activityStatus ? "Online" : "Offline"}</Text></Box>
                        </Box>

                        {/* main-chat-div */}
                        <Box width={"100%"} minH={"80%"}
                            display="flex" >
                            <Box flexBasis={"20%"} height="100%" backgroundColor={"blackAlpha.600"}>
                                <LastChatsCol last_profiles={limitedProfiles} setFriendId={getFriendId} />
                            </Box>
                            <Box flexBasis={"80%"} height="100%" backgroundColor={"blackAlpha.700"}>
                                <ChatMainCol open={openChat} setOpen={setOpenChat} user={user}
                                    friend={selFriend} messagesData={selFriendMessages} profile={profile}
                                    setMessagesData={getMessageData} />
                            </Box>
                        </Box>

                    </Box>

                </Flex>
                <FriendsBar open={true} friendsData={friendsData} user={user} friendRequests={friendRequests} setFriendId={getFriendId}>
                    <p>Hello world</p>
                </FriendsBar>
            </Flex>
        </>
    );

}
