"use client";
import {useState } from "react";
import { useRouter } from "next/navigation";
import {Box,Button,FormControl,FormLabel,Input,Heading,VStack, HStack} from "@chakra-ui/react";
import { useAuth } from "@/contexts/auth";
import Motion from "../custom-components/motion";



const Login=({open,setOpen})=>
{
    const {login,setUser}=useAuth();
    const router=useRouter();

    const [userName,setUserName]=useState("");
    const [password,setPassword]=useState("");

    const handleSubmit=async(e)=>
    {
        e.preventDefault();
  
        const res=await login(userName,password);
        if(!res)
        {
            return
        }
        router.push(`/home/${res.user.id}`);
    }

    if(!open) return null;

    return(
        <Motion open={open}>
        <Box  bgGradient="linear(to-l, teal.500, blue.500)" w="75%" mx="auto"  p={6}  borderRadius="lg" boxShadow="lg">
            <Heading>Login</Heading>
            <form>
                <VStack spacing={4} justifyContent={"end"}>
                    <FormControl>
                        <FormLabel htmlFor="userName">Username</FormLabel>
                        <Input onChange={(e)=>setUserName(e.target.value)} id="userName" name="userName"
                         required _focus={{borderColor:"white"}} color={"white"} />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input onChange={(e)=>setPassword(e.target.value)} id="password" name="password" type="password"
                         required _focus={{borderColor:"white"}} color={"white"} />
                    </FormControl>
                    <Box display={"flex"} justifyContent="flex-end" w="100%" columnGap={4}>
                        <HStack spacing={4}>
                            <Button variant="link" onClick={setOpen}>Register</Button>
                            <Button variant="link" >Login</Button>
                        </HStack>
                        <Button type="button"  onClick={handleSubmit} bg={"blue.200"} _hover={{bg:"blue.500"}} transition={"background 0.3s ease-in-out"} color={"white"}  >Login</Button>
                    </Box>
                </VStack>
            </form>
        </Box>
        </Motion>
    );
}

export default Login;