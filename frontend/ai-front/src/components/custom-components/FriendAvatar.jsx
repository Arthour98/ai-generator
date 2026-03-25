import { useState } from "react";
import CustomAvatar from "./avatar";
import { Box, Typography, Button } from "@chakra-ui/react";
import styles from "@/components/custom-components/components.module.css";

export default function FriendAvatar(id, imgSrc, nickName, status, forAdding, view) {

    const [scale, setScale] = useState(1);

    const imageRender = (src) => {
        if (src.startsWith("/storage")) {
            return `http://localhost:8000${src}`;
        }
        else {
            return src;
        }
    }

    return (
        <Box display="flex" height="80px" borderRadius="12px"
            boxShadow="2xl" dropShadow="dark-lg" backgroundColor="lightslategray"
            onMouseEnter={() => setScale(1.3)}
            onMouseLeave={() => setScale(1)}
            transition="scale 0.4s linear"
            onClick={forAdding ? () => sendInvite() : view ? () => openMessageDialog() : undefined}
            scale={scale}
        >
            <Box className={styles.friendImageCol}>
                <CustomAvatar src={imageRender(id)} shape="circle" noscale />
            </Box>
            <Box className={styles.friendNameCol}>
                {nickName}
            </Box>
            <Box className={styles.friendActionsCol}>
                {
                    forAdding &&
                    (
                        <Box display="flex" width="50%">
                            <Button content="Add friend" />
                            <Button content="X" />
                        </Box>
                    )
                }
                {
                    view &&
                    (
                        <Box display="flex" width="50%">
                            <Button content="Send message" />
                            <Button content="X" />
                        </Box>
                    )
                }
            </Box>
        </Box>
    )


}