import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Box, Text } from "@chakra-ui/react"
import CustomAvatar from "./avatar";
import CustomInput from "./customInput";
import { query } from "@/hooks/fetch";
import { capitalize } from "@/utils/capitalize";
import { MessageRow } from "./MessageRow";
import styles from "./components.module.css"

export default function ChatMainCol({ friend, open, setOpen, user, messagesData, profile, setMessagesData }) {

    const [message, setMessage] = useState("");


    const friend_obj = useMemo(() => {
        return friend;
    }, [friend]);

    const [messages, setMessages] = useState();

    useEffect(() => {
        if (!user) return;
        setMessages(messagesData);
    }, [messagesData])


    const sendMessage = useCallback(async (e) => {
        if (e.key == "Enter" && message != "") {
            const data = {
                user_id: user?.id,
                message: message,
                conversation_id: friend?.id
            }
            try {
                const res = await query("/api/chat/send-message", { method: "post", data: data })
                if (res.success == true) {
                    setMessagesData(res.messages);
                    setMessage("");
                }
            }
            catch (e) {
                console.error("ERROR:", e)
            }

        }
    }, [messages, message, setMessages])


    const last_message_ref = useRef(null);

    useEffect(() => {
        let last_ref = last_message_ref?.current;
        last_ref?.scrollIntoView({ block: "end", behavior: "smooth" })
    }, [messages, last_message_ref]);

    if (!open) return null;

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="start"
            w={"100%"} h="100%" backgroundColor="gray.800" borderRadius="12px" >
            <Box display="flex" justifyContent="center" alignItems="center" h="10%">
                <Text fontSize="26px" fontWeight="500" color="whiteAlpha.300">{capitalize(friend_obj?.nickname)}</Text>
            </Box>
            <Box display="flex" pt={"1rem"} rowGap={"20px"} flexDirection="column"
                alignItems="start" justifyContent="start" h="80%" overflowY="auto" width="100%"
                scrollBehavior={"smooth"}
                className={styles.hiddenScroll}
            >
                {messages?.map((msg, index) => (
                    <MessageRow
                        key={msg?.id}
                        id={msg?.id}
                        user={user}
                        content={msg?.messages}
                        sender_id={msg?.sender_id}
                        created_at={msg?.created_at}
                        imgSrc={msg?.sender_id == user?.id ? profile?.image_profile : friend?.image_profile}
                        length={messages?.length}
                        ref={index === messages.length - 1 ? last_message_ref : null}
                    />
                ))}
            </Box>
            <Box display="flex" h="20%" width="100%" justifyContent={"end"} padding="1rem">
                <CustomInput noLabel placeholder={"Enter text"} value={message} setValue={setMessage} type="text-area"
                    onEnter={(e) => sendMessage(e)} textColor={"green"} w="60%" h="30px" bgColor={"black"} />
            </Box>
        </Box>
    )
}


