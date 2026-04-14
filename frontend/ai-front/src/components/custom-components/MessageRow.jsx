import React, { forwardRef, memo } from "react";
import { Box, Text } from "@chakra-ui/react"
import CustomAvatar from "./avatar";
import { dateFormater } from "@/utils/dateFormater";
import { imageRender } from "@/utils/imageRender";

export const MessageRow = memo(forwardRef(({ user, content, sender_id, created_at, imgSrc }, ref) => {
    const isOwnMessage = user?.id === sender_id;



    return (
        <Box
            display="flex"
            width="80%"
            borderBottom="1px solid"
            borderColor="whiteAlpha.50"
            paddingBottom="0.5rem"
            ref={ref}
        >
            <Box display="flex" justifyContent={"center"} alignItems="center" w={"20%"} pl={isOwnMessage ? "0" : "3rem"}>
                <CustomAvatar src={imageRender(imgSrc)} noScale h="3rem" w="3rem" />
            </Box>

            <Box display="flex" flexDirection="column" w="80%" pt={"1rem"} pl={isOwnMessage ? "0" : "1.5rem"}>
                <Text color="green.400" fontSize="14px" wordBreak="break-all">
                    {content}
                </Text>
                <Text color="white" opacity="0.7" display="flex" w="100%" justifyContent="end">
                    {dateFormater(created_at)}
                </Text>
            </Box>
        </Box >
    );
})
);