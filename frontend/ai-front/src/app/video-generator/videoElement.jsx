import { Box, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from 'react';

function VideoElement({ keyItem, image, url, duration, width, height, setSelVideo }) {

    const [isHovering, setIsHovering] = useState(false);



    const formatDuration = (time) => {
        if (time < 60) {
            if (time < 9) {
                return "00:" + "0" + time;

            }
            return "00:" + time;
        }
        else if (time >= 60) {
            let incrementor = Math.floor(time / 60);
            let rest = Math.floor(time % 60);

            if (incrementor <= 9) {
                if (rest <= 9) {
                    return "0" + incrementor + ":" + "0" + rest
                }
                else {
                    return "0" + incrementor + ":" + rest
                }
            }
            else {
                if (rest <= 9) {
                    return incrementor + ":0" + rest;
                }
                else {
                    return incrementor + ":" + rest;
                }
            }

        }

    }



    return (
        <Box width={width} height={height}
            display="flex" justifyContent="space-between" padding="0.2rem 1rem"
            backgroundColor="antiquewhite"
            url={url}
            borderRadius="12px"
            margin="10px 0"
            cursor="pointer"
            opacity={isHovering ? 0.7 : 1}
            style={{ transform: isHovering ? `scale(1.1)` : `scale(1)` }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setSelVideo(url)}
            zIndex={20000}>
            <Box flex="30%">
                <Box height="100%" width="100%" aspectRatio={1} borderRadius="12px" overflow="hidden">
                    <Image src={image}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        display="block" />
                </Box>
            </Box>
            <Box flex="30%" >
                <Text textAlign={"center"} color="blackAlpha.900">
                    {keyItem}
                </Text>
            </Box>
            <Box flex="30%" textAlign={"center"} color="red.600">
                {formatDuration(duration)}
            </Box>
        </Box>
    )
}
export default VideoElement;