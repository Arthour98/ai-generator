import { useEffect, useState, useRef } from "react";
import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";



export const Loader = ({ open, setOpen }) => {

    const [loaderScale, setLoaderScale] = useState(1);
    const [loaderOpacity, setLoaderOpacity] = useState(1);
    const [loaderRotate, setLoaderRotate] = useState(0);
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);
    const dir = useRef(1);

    useEffect(() => {
        if (!open) return;

        const t = setInterval(() => {
            setLoaderScale(prev => {
                let next = prev + dir.current * 0.1;

                if (next >= 1.5) {
                    dir.current = -1;
                    return 1.5;
                }

                if (next <= 1) {
                    dir.current = 1;
                    return 1;
                }

                return next;
            });
            setLoaderOpacity(prev => {
                let next = prev - 0.1;
                if (dir == -1 || next <= 0.2) {
                    next = prev + 0.1;
                }
                else if (dir == 1) {
                    next = prev + 0.1;
                }
                return next;
            }
            );
        }, 200);

        let r = setInterval(() => {
            setLoaderRotate(prev => (prev + 10) % 360)
        }, 60)

        return () => {
            clearInterval(r);
            clearInterval(t);
        }
    }, [open]);

    useEffect(() => {
        if (typeof window != "undefined" && typeof screen !== "undefined") {
            setX(screen?.width / 2);
            setY(screen?.height / 2);
        }
    }, [open])

    if (!open) return null;

    return (
        <Box width={"100%"}
            height={"100vh"}
            position="fixed"
            top="0"
            left="0"
            backgroundColor="rgba(0,0,0,0.3)"
        >
            <Box
                border={"8px dashed"}
                color="cyan.500"
                position="absolute"
                left={x}
                top={y}
                width="100px"
                height="100px"
                borderRadius="50%"
                transform={`translate(-50%, -100%) scale(${loaderScale}) rotate(${loaderRotate}deg)`}
                display="flex"
                opacity={loaderOpacity}
                justifyContent={"center"}
                alignItems={"center"}
            >

                <Text
                    transform={`rotate(${-loaderRotate}deg)`}
                    color="cyan.500">
                    Load
                </Text>
            </Box>
        </Box>
    )

}