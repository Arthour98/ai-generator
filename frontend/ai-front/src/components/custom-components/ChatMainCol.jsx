import { useState, useEffect, useMemo, useCallback } from "react";
import {Box,Text} from "@chakra-ui/react"
import CustomAvatar from "./avatar";
import CustomInput from "./customInput";
import { query } from "@/hooks/fetch";

export default function ChatMainCol({ friend, open, setOpen, user, messagesData }) {

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
        if (e.key == "enter") {
            const data = {
                user_id: user?.id,

            }

        }
    }, [messages])


    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            {
                friend_obj
            }
        </Box>
    )


}


