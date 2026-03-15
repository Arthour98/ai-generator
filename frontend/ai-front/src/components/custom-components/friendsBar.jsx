import { Box, Input } from "@chakra-ui/react";
import { Stack, HStack, VStack, Text, FormControl, FormLabel } from '@chakra-ui/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUserGroup, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./components.module.css";
import { useState } from "react";



function FriendsBar({ open, setOpen, children }) {
    if (!open) return;

    const [friendsMode, setFriendsMode] = useState("display_friends");


    return (
        <Box id="FriendsBar" width="450px" height="100vh"
            position="fixed" background={"blackAlpha.500"}
            top="0" right="0"
        >
            <VStack spacing="1rem" width="full" height="full" alignItems={"start"} >
                <Box className={styles.iconAndActionWrapper}>
                    <Box className={styles.iconBar}>
                        <FontAwesomeIcon
                            onClick={() => setFriendsMode("search_friend")}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            icon={faMagnifyingGlass} width={"20px"} height="20px" cursor="pointer" color="gray" />
                        <FontAwesomeIcon
                            onClick={() => setFriendsMode("display_friends")}
                            icon={faUserGroup} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            width={"20px"} height="20px" cursor="pointer" color="gray" />
                        <FontAwesomeIcon
                            onClick={() => setFriendsMode("add_friend")}
                            icon={faPlus} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            width={"20px"} height="20px" cursor="pointer" color="gray" />
                    </Box>
                    <Box className={styles.actionFriendsRow}>
                        {
                            friendsMode == "display_friends" ?
                                (
                                    <Box className={styles.displayFriendsWrapper}>
                                        <Text color={"white"} backgroundColor={"gray.800"}
                                            padding="0.5rem" borderRadius={"12px"}
                                            cursor={"pointer"}
                                            _hover={{ backgroundColor: "gray.700" }}>
                                            Friends
                                        </Text>
                                        <Text color={"white"} backgroundColor={"gray.800"}
                                            padding="0.5rem" borderRadius={"12px"}
                                            cursor="pointer"
                                            _hover={{ backgroundColor: "gray.700" }}>
                                            Pending Requests
                                        </Text>
                                    </Box>
                                ) :
                                friendsMode == "search_friend" ?
                                    (
                                        <Box className={styles.searchFriendsWrapper}>
                                            <FormControl>
                                                <FormLabel color="white">Search</FormLabel>
                                                <Input type="search" placeholder="Search friends" color="white" />
                                            </FormControl>
                                        </Box>
                                    )
                                    : friendsMode == "add_friend" ?
                                        (
                                            <Box className={styles.addFriendWrapper}>
                                                <FormControl>
                                                    <FormLabel color="white">Add friend</FormLabel>
                                                    <Input type="search" placeholder="Add new friend" color="white" />
                                                </FormControl>
                                            </Box>
                                        ) : null
                        }
                    </Box>
                </Box>
            </VStack>
        </Box>
    )
}

export default FriendsBar;