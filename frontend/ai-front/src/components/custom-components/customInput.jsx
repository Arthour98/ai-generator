import { Input, Box, FormLabel } from "@chakra-ui/react";



export default function CustomInput({ label, value, setValue, type, placeholder,
    bgColor, textColor, paddingX, paddingY, w, h, horizontal, vertical, placeholderColor, gap, onFocus }) {


    return (
        <Box display={"flex"} w={w}
            flexDirection={horizontal ? "row" : "column"}
            alignItems={horizontal ? "center" : "start"}
            gap={gap}
        >
            <FormLabel minWidth={"30%"} maxWidth={"30%"} marginBottom={0} flexShrink={0}>{`${label} : `}</FormLabel>
            <Input flexBasis={"70%"} type={type} value={value}
                onChange={(e) => setValue(e.target.value)} backgroundColor={bgColor}
                paddingX={paddingX} paddingY={paddingY} placeholder={placeholder} color={textColor}
                _placeholder={{ color: placeholderColor ?? "gray.300" }} h={h}
                fontSize={"1rem"} size={undefined} onFocus={() => onFocus()} />
        </Box>
    )
}