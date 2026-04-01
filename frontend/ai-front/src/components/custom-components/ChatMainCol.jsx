import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Text } from "@chakra-ui/react"
import CustomAvatar from "./avatar";
import CustomInput from "./customInput";
import { query } from "@/hooks/fetch";

export default function ChatMainCol({ friend, open, setOpen, user, messagesData }) {

    const [message, setMessage] = useState("");

    const imageRender = (src) => {
        if (src.startsWith("/storage")) {
            return `http://localhost:8000${src}`;
        }
        else {
            return src;
        }
    }

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
                const res = query("/api/chat/send-message", { method: "post", data: data })
                if (res.success == true) {
                    setMessages(res.messages)
                    setMessage("");
                }
            }
            catch (e) {
                console.error("ERROR:", e)
            }

        }
    }, [messages, message])

    if (!open) return;

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="start"
            w={"100%"} h="100%" backgroundColor="gray.800" borderRadius="12px">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="start" h="80%">
                {
                    //friend_obj
                }
            </Box>
            <Box display="flex" h="20%" width="100%" justifyContent={"end"} padding="1rem">
                <CustomInput noLabel value={message} setValue={setMessage} type="text-area"
                    onEnter={(e) => sendMessage(e)} textColor={"green"} w="60%" h="30px" bgColor={"black"} />
            </Box>
        </Box>
    )


}


