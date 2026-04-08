"use client";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, HStack } from "@chakra-ui/react";
import { useAuth } from "@/contexts/auth";
import Motion from "../custom-components/motion";



const Login = ({ open, setOpen, loginPhase }) => {
    const { login, setUser } = useAuth();
    const router = useRouter();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    //err states
    const [errName, setErrName] = useState(false);
    const [errPass, setErrPass] = useState(false);

    // loader state
    const [isLogging, setIsLogging] = useState(false);

    useEffect(() => {
        const handleSubmitOnEnter = (e) => {
            if (userName !== "" && password !== "") {
                if (e.key == "Enter") {
                    handleSubmit(e);
                }
            }
            return;
        }
        window.addEventListener('keydown', handleSubmitOnEnter);
        return () => {
            window.removeEventListener("keydown", handleSubmitOnEnter);
        };

    }, [userName, password])

    const clearErr = useCallback((err) => {
        if (err?.error == "name") {
            console.log(err?.error)
            setErrName(false);
        }
        if (err?.error == "password") {
            setErrPass(false);
        }
    }, [errName, errPass])

    const handleSubmit = async (e) => {
        setIsLogging(true);
        e.preventDefault();

        const res = await login(userName, password);
        console.log(res);
        if (res.response?.data?.message == "Invalid credentials" || res.status == 401) {
            setIsLogging(false);
            setErrName(true);
            setErrPass(true);
            return
        }
        router.push(`/image-generator`);
    }

    if (!open) return null;

    return (
        <Motion open={open}>
            <Box bgGradient="linear(to-l, teal.500, blue.500)" w="75%" mx="auto" p={6} borderRadius="lg" boxShadow="lg">
                <Heading>Login</Heading>
                <form>
                    <VStack spacing={4} justifyContent={"end"}>
                        <FormControl>
                            <FormLabel htmlFor="userName">Username</FormLabel>
                            <Input onChange={(e) => setUserName(e.target.value)} id="userName" name="userName" type="text" backgroundColor={"transparent"}
                                required _focus={{ borderColor: "white" }} color={"white"} variant={"outline"}
                                _complete={{ backgroundColor: "transparent !important" }}
                                isInvalid={errName} errorBorderColor="red.600"
                                onFocus={() => clearErr({ error: "name" })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password"
                                required _focus={{ borderColor: "white" }} color={"white"}
                                isInvalid={errPass} errorBorderColor="red.600"
                                onFocus={() => clearErr({ error: "password" })} />
                        </FormControl>
                        <Box display={"flex"} justifyContent="flex-end" w="100%" columnGap={4}>
                            <HStack spacing={4}>
                                <Button variant="link" onClick={setOpen}>Register</Button>
                                {loginPhase ?
                                    null
                                    :
                                    <Button variant="link" >Login</Button>
                                }
                            </HStack>
                            <Button isLoading={isLogging} type="button" onClick={handleSubmit} bg={"blue.200"} _hover={{ bg: "blue.500" }} transition={"background 0.3s ease-in-out"} color={"white"}  >Login</Button>
                        </Box>
                    </VStack>
                </form>
            </Box>
        </Motion>
    );
}

export default Login;