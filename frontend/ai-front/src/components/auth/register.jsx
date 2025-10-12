
import React from "react";
import {useRouter} from "next/navigation";
import {Box,Button,FormControl,FormLabel,Input,Heading,VStack, HStack} from "@chakra-ui/react";
import { useAuth } from "@/contexts/auth";
import {useState } from "react";
import Motion from "../custom-components/motion";



 const Register=({open,setOpen})=>
{
  

    const {register,user,setUser}=useAuth();
    const router=useRouter();

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit=async(e)=>
    {
        e.preventDefault();
        const res= await register(userName,email,password);

        if(res && res.user)
        {
            setUser(res.user);
            router.push("/home");
        }
            setEmail("");
            setPassword("");
            setUserName("");
            return;
        
    }



    if(!open) return null;

    return(
        <Motion open={open}>
        <Box bgGradient="linear(to-l, teal.500, blue.500)" w="75%" mx="auto"  p={6}  borderRadius="lg" boxShadow="lg">
            <Heading>Register</Heading>
            <form>
                <VStack spacing={4} justifyContent={"end"}>
                    <FormControl>
                        <FormLabel htmlFor="userName">Username</FormLabel>
                        <Input id="userName" name="userName" required
                        _focus={{borderColor:"white"}} color={"white"}
                        onChange={(e) => setUserName(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input id="email" name="email" type="email" required
                        _focus={{borderColor:"white"}} color={"white"}
                        onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input id="password" name="password" type="password" required
                        _focus={{borderColor:"white"}} color={"white"}
                        onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <Box display={"flex"} justifyContent="flex-end" w="100%" columnGap={4}>
                        <HStack spacing={4}>
                            <Button variant="link">Register</Button>
                            <Button variant="link" onClick={setOpen}>Login</Button>
                        </HStack>
                        <Button bg={"blue.200"} _hover={{bg:"blue.500"}}
                         transition={"background 0.3s ease-in-out"} color={"white"}
                        type="submit" onClick={handleSubmit} >Register</Button>
                    </Box>
                </VStack>
            </form>
        </Box>
        </Motion>
    );
}

export default Register;