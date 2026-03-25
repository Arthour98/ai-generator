
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, HStack } from "@chakra-ui/react";
import { useAuth } from "@/contexts/auth";
import { useState } from "react";
import Motion from "../custom-components/motion";



const Register = ({ open, setOpen, registerPhase }) => {


    const { register, user, setUser } = useAuth();
    const router = useRouter();
    const userId = user?.id;

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    //error States
    const [errName, setErrName] = useState(false);
    const [errPass, setErrPass] = useState(false);
    const [errEmail, setErrEmail] = useState(false);

    //loader state
    const [isRegistering, setIsRegistering] = useState(false);



    useEffect(() => {
        const handleSubmitOnEnter = (e) => {
            if (userName !== "" && password !== "" && email !== "") {
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

    }, [userName, password, email])

    const validate_creds = useCallback(() => {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let valid = true;
        if (userName === "" || userName.length < 2) {
            setErrName(true);
            valid = false;
        }
        if (email === "" || !email.match(regex)) {
            setErrEmail(true);
            valid = false;
        }
        if (password.length < 4 || password === "") {
            setErrPass(true);
            valid = false;
        }
        return valid;
    }, [userName, email, password, errName, errPass, errEmail]);



    // clear errors
    const clearErr = (err) => {
        if (err.error == "name") {
            setErrName(false)
        }
        if (err.error == "email") {
            setErrEmail(false)
        }
        if (err.error == "password") {
            setErrPass(false)
        }
    }

    const handleSubmit = async (e) => {
        setIsRegistering(true);
        e.preventDefault();


        if (!validate_creds()) {
            setIsRegistering(false);
            return;
        }

        const res = await register(userName, email, password);

        if (res && res.user) {
            setUser(res.user);
            router.push(`/home/${res?.user?.id}`);
        }
        setEmail("");
        setPassword("");
        setUserName("");
        return;

    }



    if (!open) return null;

    return (
        <Motion open={open}>
            <Box bgGradient="linear(to-l, teal.500, blue.500)" w="75%" mx="auto" p={6} borderRadius="lg" boxShadow="lg">
                <Heading>Register</Heading>
                <form>
                    <VStack spacing={4} justifyContent={"end"}>
                        <FormControl>
                            <FormLabel htmlFor="userName">Username</FormLabel>
                            <Input id="userName" name="userName" required
                                _focus={{ borderColor: "white" }} color={"white"}
                                onChange={(e) => setUserName(e.target.value)}
                                isInvalid={errName} errorBorderColor="red.600"
                                onFocus={() => clearErr({ error: "name" })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input id="email" name="email" type="email" required
                                _focus={{ borderColor: "white" }} color={"white"}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={errEmail} errorBorderColor="red.600"
                                onFocus={() => clearErr({ error: "email" })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input id="password" name="password" type="password" required
                                _focus={{ borderColor: "white" }} color={"white"}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={errPass} errorBorderColor="red.600"
                                onFocus={() => clearErr({ error: "password" })} />
                        </FormControl>
                        <Box display={"flex"} justifyContent="flex-end" w="100%" columnGap={4}>
                            <HStack spacing={4}>
                                {registerPhase ?
                                    null
                                    :
                                    <Button variant="link">Register</Button>
                                }
                                <Button variant="link" onClick={setOpen}>Login</Button>
                            </HStack>
                            <Button bg={"blue.200"} _hover={{ bg: "blue.500" }}
                                transition={"background 0.3s ease-in-out"} color={"white"}
                                type="submit" onClick={handleSubmit}
                                isLoading={isRegistering} >Register</Button>
                        </Box>
                    </VStack>
                </form>
            </Box>
        </Motion>
    );
}

export default Register;