import { Box } from "@chakra-ui/react";



function FriendsBar({ open, setOpen, children }) {
    if (!open) return;

    return (
        <Box id="FriendsBar" width="300px" height="100vh"
            position="fixed" background={"blackAlpha.500"}
            top="0" right="0"
        >
            {children}
        </Box>
    )
}

export default FriendsBar;