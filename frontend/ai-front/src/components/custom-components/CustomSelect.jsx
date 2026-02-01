"use client"
import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Text } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState, useMemo, useEffect } from "react";
import CustomInput from "./customInput";

export default function CustomSelect({
    data = [],
    placeholder = "Select option",
    onChange,
    w = "400px",
    h = "50px",
    value,
    setValue,
    search,
    name,
    url
}) {

    const [selected, setSelected] = useState(value || "");
    const [searchCountry, setSearchCountry] = useState("");

    useEffect(() => {
        if (value) {
            setSelected(value)
        }
    }, [value])
    const dataCopy = useMemo(() => {
        if (!Array.isArray(data)) return [];
        if (searchCountry === "") return data;

        return data.filter(d => {
            const val = typeof d === "object" ? d[name] : d;
            return val?.toLowerCase().startsWith(searchCountry.toLowerCase());
        });
    }, [searchCountry, data, name]);

    const handleSelect = (item) => {
        const displayValue = typeof item === "object" ? item[name] : item;
        setSelected(displayValue);
        setValue(item);
        if (onChange) onChange(item);
    };

    return (
        <Menu lazyBehavior="keepMounted" isLazy>
            <Box
                minW={w}
                maxW={w}
                h={h}
                boxSizing="border-box"
                position="relative"

            >
                <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bg="blackAlpha.800"
                    color="white"
                    border="2px solid pink"
                    _hover={{ bg: "blackAlpha.700" }}
                    _active={{ bg: "blackAlpha.900" }}
                    w={"100%"}
                    textAlign="left"
                    overflowX={"hidden"}
                >
                    {selected || placeholder}
                </MenuButton>
                <MenuList bg="blackAlpha.900" border="3px solid pink"
                    w={w}
                    maxW={w}
                    minWidth={"300px"}
                    px={"1rem"}
                    maxH="400px"
                    overflowY="auto"
                    overflowX="hidden"
                    scrollBehavior={"smooth"}
                    position="absolute"
                    top={"100%"}
                >
                    {search && (
                        <Box paddingLeft="1rem">
                            <CustomInput w="200px" label="Search" value={searchCountry} setValue={setSearchCountry} />
                        </Box>
                    )}

                    {dataCopy.map((item, index) => {
                        const displayValue = typeof item === "object" ? item[name] : item;
                        return (
                            <MenuItem
                                key={index}
                                data-attribute={typeof item === "object" ? item[name] : item}
                                onClick={() => handleSelect(item)}
                                _hover={{ bg: "pink.500", color: "white" }}
                                bg="blackAlpha.900"
                                color="white"
                                overflowX={"hidden"}
                                w={"100%"}
                                display={"block"}
                                style={{ overflowY: "hidden !important" }}
                            >
                                <Text overflowX={"hidden"} w={"100%"}>
                                    {displayValue}
                                </Text>
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Box>
        </Menu >
    );
}