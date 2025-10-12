"use client";
import { Box,Flex,Text, HStack, VStack,Divider,Button, Card } from "@chakra-ui/react"; 
import SettingsBar from "@/components/partials/settingsBar";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import ImageUploader from "@/components/custom-components/imageUploader";
import { useState,useEffect} from "react";
import CustomInput from "@/components/custom-components/customInput";
import CustomAvatar from "@/components/custom-components/avatar";


export default  function ProfileSettingsPage() 
{
    const {user}=useAuth(); 



    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [userId,setUserId]=useState();

 useEffect(()=>
{
  if(user)
  setUsername(user?.name);
  setUserId(user?.id);
  setEmail(user?.email);
},[user])

  {/*const fetchUser=async()=>
  {
     const res = await fetch("http://localhost:8000/api/user", {
     credentials: "include", //  this will send the cookie
      });
  if(res.ok)
  {
  const user = await res.json();
  const userId = user.id;
  const Username=user.name;
  const Email=user.email;
  setUser(user)
  setUsername(Username);
  setEmail(Email);
  setUserId(userId)
  }
  }



  useEffect(()=>
  {
    fetchUser();
  },[])  */}

  
    

    const handleClear=()=>
    {
      setEmail('');
      setUsername('');
      setPassword('');
    }

    const handleSave=()=>
    {
      console.log("saved");
    }
  
    

        return (
          <>
          <Flex direction={"row"}  justifyContent={"flex-start"} overflowY="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
            <Sidebar userId={userId} />
            <Flex direction={"column"} alignItems={"center"} width={"60%"}>
                <SettingsBar />
              <Box w="100%" position  padding={4} display={"flex"}  border={"1px solid black"} shadow={"md"} minH={"80vh"}>
                <VStack spacing={4} w={"100%"} align="center">
                    <Text fontSize="2xl" fontWeight="bold">Account Settings</Text>
                    <Divider width={"50%"}/>
                    <HStack >
                      <CustomInput
                        placeholder={"Username"}
                        value={username}
                        setValue={setUsername}
                        paddingX={4}
                        paddingY={2}
                        label={"Username"}
                        horizontal
                        textColor={"white"}
                        h={"30px"}
                        bgColor={"black"}
                        w={"300px"}
                        />
                    </HStack>
                    <Divider width={"50%"}/>
                     <HStack>
                      <CustomInput
                        placeholder={"Password"}
                        value={password}
                        setValue={setPassword}
                        paddingX={4}
                        paddingY={2}
                        label={"Age"}
                        horizontal
                        textColor={"white"}
                        h={"30px"}
                        bgColor={"black"}
                        w={"300px"}
                        type="password"
                        />
                    </HStack>
                    <Divider width={"50%"}/>
                    <HStack>
                      <CustomInput
                        placeholder={"Email"}
                        value={email}
                        setValue={setEmail}
                        paddingX={4}
                        paddingY={2}
                        label={"Email"}
                        horizontal
                        textColor={"white"}
                        h={"30px"}
                        bgColor={"black"}
                        w={"300px"}
                        type="email"
                        />
                    </HStack>
                    <Divider width={"50%"}/>
                    <HStack spacing={4} height={100}>
                      <Button onClick={handleClear} color="white" bg={"gray.400"} _hover={{bg:"gray.600"}}>
                        Clear
                      </Button>
                      <Button onClick={handleSave} color="white" bg={"green.400"} _hover={{bg:"green.600"}}>
                        Save
                      </Button>
                    </HStack>
                </VStack>
              </Box>
    
            </Flex>
          </Flex>
          </>
        );
}