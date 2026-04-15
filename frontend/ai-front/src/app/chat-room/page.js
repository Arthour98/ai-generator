"use client";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import SettingsBar from "@/components/partials/settingsBar";
import { useState, useEffect, useCallback, useMemo, useLayoutEffect } from "react";
import { query } from "@/hooks/fetch";
import { Box, Text, Flex, Card, VStack, Divider } from "@chakra-ui/react";
import FriendsBar from "../../components/custom-components/friendsBar";
import CustomAvatar from "@/components/custom-components/avatar";
import CustomSwitch from "@/components/custom-components/customSwtich";
import LastChatsCol from "@/components/custom-components/LastChatsCol";
import ChatMainCol from "@/components/custom-components/ChatMainCol";
import Motion from "@/components/custom-components/motion";
import { isMobile } from "@/hooks/isMobile";
import { imageRender } from "@/utils/imageRender";

export default function ChatPage() {

    const mobile = isMobile();

    const { user } = useAuth();
    const [image, setImage] = useState("");
    const [profile, setProfile] = useState();
    const [nickName, setNickname] = useState();
    const [activityStatus, setActivityStatus] = useState(false);


    // data for all friends
    const [friendsData, setFriendsData] = useState();
    const [friendRequests, setFriendRequests] = useState([]);
    const [userMessages, setUserMessages] = useState([]);

    const getProfile = async () => {
        const userId = user?.id;
        const data = {
            user_id: userId
        }
        const res = await query("/api/profile", { params: data })

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
            if (profile.status_activity == "online") {
                setActivityStatus(true)
            }
            else {
                setActivityStatus(false);
            }

        }
        else {
            console.log("error fetching profile");
        }
    }

    const switchStatus = useCallback(async () => {
        const data =
        {
            user_id: user?.id,
            profile_id: profile?.id,
            status: activityStatus == true ? "offline" : "online"
        }
        try {
            const res = await query("/api/chat/status-switch", { method: "post", data: data })
        }
        catch (e) {
            console.error("ERROR:", e)
            return;
        }
    }, [activityStatus])



    const getFriends = async () => {
        try {
            const res = await query(`/api/chat/friends/${user?.id}`, { method: "get" });
            if (res) {
                const profiles = res?.data?.filter(d => d.status == "accepted").map(d => {
                    d.profile.profile_id = d?.profile?.id;
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
                let new_messages = res?.data?.map(d => {
                    const obj =
                    {
                        conversation_id: d["messages"][0]?.friends_conversation ?? null,
                        messages: d.messages
                    }
                    return obj
                });

                setUserMessages(new_messages)
            }
        }
        catch (e) {
            console.error(e);
        }
    } // need polling on low secs



    useEffect(() => {
        if (!user) return;
        getProfile();
        getFriends(); // INITIAL
        getMessages(); // INITIAL
        let t_friends = setInterval(() => {
            getFriends();
        }, 10000);

        let t_messages = setInterval(() => {
            getMessages();
        }, 3500)

        return () => {
            clearInterval(t_friends);
            clearInterval(t_messages)
        }


    }, [user]);

    const [friendActiveId, setFriendActiveId] = useState();

    const getFriendId = useCallback((friend_id) => {
        setFriendActiveId(friend_id);
    }, [friendActiveId])


    ////////////// openChat state
    const [openChat, setOpenChat] = useState(false);

    const selFriend = useMemo(() => {

        let selectedFriend = friendsData?.filter(f => f.friend_id == friendActiveId)
        if (friendActiveId == null) {
            return {}
        }
        else if (selectedFriend && Object.keys(selectedFriend[0])?.length != 0) {
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
            let friendMessages = userMessages?.filter(data => data?.conversation_id == selFriend?.id);
            return friendMessages[0]?.messages;
        }
    }, [selFriend, userMessages, friendActiveId])

    const getMessageData = useCallback((data) => {

        if (!selFriend || !userMessages) return;
        let new_data =
        {
            conversation_id: selFriend?.id,
            messages: data
        }
        let selIndex = Array.from(userMessages).findIndex(m => m.conversation_id == selFriend?.id);
        let new_messages = Array.from(userMessages).splice(selIndex, 1, new_data)

        setUserMessages(new_messages);
    }, [selFriend, userMessages]);

    useEffect(() => {
        if (Object.keys(selFriend)?.length == 0) {
            return;
        }
        else {
            setOpenChat(true);
        }
    }, [selFriend])

    const [limitedProfiles, setLimitedProfiles] = useState([]);



    useEffect(() => {
        if (!friendActiveId) return
        let lastFriend = selFriend;
        let last_friend_list = Array.from(limitedProfiles) ?? [];
        let existing_item = false;

        if (last_friend_list?.length > 0) {
            if (last_friend_list.find(li => li.id == selFriend?.id)) {
                existing_item = true;
            }
            else {
                existing_item = false;
            }
        }

        if (existing_item) {
            return;
        }
        if (last_friend_list?.length < 3) {
            last_friend_list.push(lastFriend);
        }
        else if (last_friend_list?.length >= 3) {
            last_friend_list.pop();
            last_friend_list.unshift(lastFriend);
        }
        localStorage.setItem("last_profiles", JSON.stringify(last_friend_list))
    }, [openChat, friendActiveId, friendsData, limitedProfiles])

    useEffect(() => {
        let last_profiles = JSON.parse(localStorage.getItem('last_profiles')) ?? [];
        setLimitedProfiles(last_profiles);
    }, []);

    useEffect(() => { // an updater effect to update the local storage when it detectects changes in
        // friendsData so profiles from friendsData match with the profiles in local Storage
        if (friendsData?.length == 0 || !friendsData || !limitedProfiles?.length) return;
        let last_friend_list = [...limitedProfiles];
        let obj = {};
        let ref_obj = {};
        for (let i = 0; i < last_friend_list?.length; i++) {
            obj = last_friend_list[i];
            ref_obj = Array?.from(friendsData).find(d => d?.friend_id == obj?.friend_id);
            for (let key in obj) {
                if (JSON.stringify(obj[key]) != JSON?.stringify(ref_obj[key])) {
                    obj[key] = ref_obj[key]
                }
                else {
                    obj[key] = obj[key];
                }
            }
            last_friend_list[i] = obj;
            obj = null;
            ref_obj = null;
        }
        localStorage.setItem("last_profiles", JSON.stringify(last_friend_list))
    }, [limitedProfiles, friendsData])

    const [openMobile, setOpenMobile] = useState(false); // state that works on mobiles 
    // and responsible for rendering the friendsBar

    const getOpenRequest = useCallback((bool) => {
        if (bool == true) {
            setOpenMobile(true)
        }
    }, [openMobile]);

    const getOpen = useCallback((data) => {
        if (data == false) {
            setOpenMobile(false);
        }
    }, [openMobile])

    const [openBar, setOpenBar] = useState(false);

    useLayoutEffect(() => {
        if (!isMobile) {
            let r = setTimeout(() => {
                setOpenBar(true)
                clearTimeout(r);
            }, 2000)
        }
        else {
            setTimeout(() => {
                let r = setTimeout(() => {
                    setOpenBar(() => {
                        setOpenBar(true);
                        clearTimeout(r)
                    })
                })
            })
        }
    }, [isMobile])


    return (
        <>
            <Flex direction={{ base: "column", lg: "row" }} justifyContent={"flex-start"} overflow={{ base: "visible", lg: "hidden" }} overflowY="hidden" alignItems={"flex-start"} gap={{ base: 2, lg: 20 }} height={{ base: "auto", lg: "100vh" }}>
                <Sidebar userId={user?.id} />
                <Flex direction={"column"} alignItems={"start"} p={2}
                    width={{ base: "100%", md: "70%", lg: "80%", xl: "80%" }}>
                    <SettingsBar ProfileImage={imageRender(image)}
                        openMobileFriendsBar={getOpenRequest} />
                    <Box w={{ base: "100%", md: "100%", lg: "70%", xl: "70%" }}
                        position
                        padding={{ base: 4, lg: 8 }}
                        display={"flex"}
                        shadow={"md"}
                        minH={{ base: "80vh", lg: "85vh" }}
                        height={{ base: "80vh", lg: "85vh" }}
                        flexDirection={"column"}
                        alignItems={"center"}
                        rowGap={3}
                        bg={"blackAlpha.800"}
                        borderRadius={12}
                        color={'white'}
                        overflowY="hidden"
                        overflow={{ base: "visible", lg: "visible" }}
                    >
                        <Box width="100%" height={{ base: "5%", md: "5%", lg: "10%" }} display="flex" alignItems="center" gap="1rem"
                            backgroundColor="whiteAlpha.500" borderRadius="15px" padding="0.5rem 1rem">
                            <CustomAvatar src={imageRender(image)} w={{ base: 6, md: 6, lg: 12 }} h={{ base: 6, md: 6, lg: 12 }} noScale={true} />
                            <CustomSwitch callback={switchStatus} value={activityStatus} setValue={() => setActivityStatus(prev => !prev)} />
                            <Box display="flex" columnGap={"1rem"}>
                                <Text>Status:</Text>
                                <Text color={activityStatus ? "green.800" : "red.800"}>{activityStatus ? "Online" : "Offline"}</Text></Box>
                        </Box>

                        {/* main-chat-div */}
                        <Box width={"100%"} borderRadius="12px" minH={{ base: "90%", md: "90%", lg: "90%" }} overflow="hidden"
                            display="flex" flexDirection={{ base: "column", md: "row", lg: "row" }} borderBottomRadius={"12px"} >
                            <Box flexBasis={{ base: "10%", md: "30%", lg: "20%" }}
                                paddingTop={"1rem"} height={{ base: "auto", lg: "100%" }}
                                backgroundColor={"blackAlpha.600"}
                            >
                                <LastChatsCol last_profiles={limitedProfiles} setFriendId={getFriendId} mobile={mobile} />
                            </Box>
                            <Box flexBasis={{ base: "90%", lg: "80%" }} height={{ base: "100%", lg: "100%" }} backgroundColor={"blackAlpha.700"} pt={"0.5rem"}>
                                <Motion open={openChat} h={"inherit"} w="inherit" >
                                    <ChatMainCol open={openChat} setOpen={setOpenChat} user={user}
                                        friend={selFriend} messagesData={selFriendMessages} profile={profile}
                                        setMessagesData={getMessageData} />
                                </Motion>
                            </Box>
                        </Box>

                    </Box>

                </Flex>
                <FriendsBar
                    open={openBar} friendsData={friendsData} user={user}
                    friendRequests={friendRequests} setFriendId={getFriendId}
                    isMobile={mobile} openInMobile={openMobile} setOpen={getOpen}
                >
                    <p>Hello world</p>
                </FriendsBar>
            </Flex>
        </>
    );

}
