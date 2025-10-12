import { Box, Switch,Text } from "@chakra-ui/react";

export default function CustomSwitch({label,color,value,setValue})
{
    return(
        <Box display="flex" gap={4} alignItems="center">
            <Text fontFamily={"roboto"} fontWeight={"bold"} color={color}>
                {label}
            </Text>
            <Switch isChecked={value} onChange={setValue} colorScheme={"green"}/>
        </Box>
    )
}