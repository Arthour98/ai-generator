"use client"
import { Box,Flex,Text, HStack, VStack,Divider,Button, Card } from "@chakra-ui/react"; 
import SettingsBar from "@/components/partials/settingsBar";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import ImageUploader from "@/components/custom-components/imageUploader";
import { useState, useEffect,useCallback } from "react";
import CustomInput from "@/components/custom-components/customInput";
import CustomAvatar from "@/components/custom-components/avatar";
import { query } from "@/hooks/fetch";






export default function ProfileSettingsPage() 
{

    const {user}=useAuth();
    const [profile,setProfile]=useState(null);
    const userId=user?.id;

  const createProfile=async()=>
  {
  let UserId = user?.id;
  console.log("UserId:", UserId);

      const data=
      {
        user_id:UserId,
        nickname:nickname,
        age:age,
        country:country,
        image_profile:image
      }
      const res= await query('http://localhost:8000/api/profile/create',{data:data,method:"post"});
      if(res)
      {
        setProfile(res.profile)
        console.log("user_created");
      }
      else
      {
        console.log("sheni dead mothan");
      }
    }

    const getProfile=async()=>
    {
      const userId=user?.id;
      const data={
        user_id:userId
      }
      const res=await query("http://localhost:8000/api/profile",{params:data})

      if(res)
      {
        const profile=res.profile;
        setProfile(profile);
        setNickname(profile.nickname);
        setAge(profile.age);
        setCountry(profile.country);
        setImage(profile.image_profile);
        console.log(image);
        
      }
      else
      {
        console.log("error fetching profile");
      }
    }

    useEffect(()=>
    {
      if(!user)return
      getProfile();
    },[user]);



    const [image,setImage]=useState(null);
    const [nickname,setNickname]=useState("");
    const [age,setAge]=useState("");
    const [country,setCountry]=useState("")
    

    const handleClear=()=>
    {
      setNickname('');
      setAge('');
      setCountry('');
    }

  const imageRender=useCallback((src)=>
  {

  if(src?.startsWith("/storage"))
  {
    return `http://localhost:8000${src}`
  }
  else
  {
    return src
  }
  },[image])

 
  
        return (
          <>
          <Flex direction={"row"}  justifyContent={"flex-start"} overflowY="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
            <Sidebar userId={userId} />
            <Flex direction={"column"} alignItems={"center"} width={"60%"}>
                <SettingsBar />
              <Box w="100%" position  padding={4} display={"flex"}  border={"1px solid black"} shadow={"md"} minH={"80vh"}>
                <VStack spacing={4} w={"50%"} align="start">
                    <Text fontSize="2xl" fontWeight="bold">Profile Settings</Text>
                    <HStack spacing={4} align="center">
                        <Text fontSize="lg" fontWeight="semibold">Image profile </Text>
                        <ImageUploader value={imageRender(image)} setValue={setImage} shape="circle" />
                    </HStack>
                    <Divider width={"50%"}/>
                    <HStack >
                      <CustomInput
                        placeholder={"Nickname"}
                        value={nickname}
                        setValue={setNickname}
                        paddingX={4}
                        paddingY={2}
                        label={"Nickname"}
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
                        placeholder={"Age"}
                        value={age}
                        setValue={setAge}
                        paddingX={4}
                        paddingY={2}
                        label={"Age"}
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
                        placeholder={"Country"}
                        value={country}
                        setValue={setCountry}
                        paddingX={4}
                        paddingY={2}
                        label={"Country"}
                        horizontal
                        textColor={"white"}
                        h={"30px"}
                        bgColor={"black"}
                        w={"300px"}
                        />
                    </HStack>
                    <Divider width={"50%"}/>
                    <HStack spacing={4} height={100}>
                      <Button onClick={handleClear} color="white" bg={"gray.400"} _hover={{bg:"gray.600"}}>
                        Clear
                      </Button>
                      <Button onClick={createProfile} color="white" bg={"green.400"} _hover={{bg:"green.600"}}>
                        Save
                      </Button>
                    </HStack>
                </VStack>
                <Box width={"50%"} >
                  <Card height={"100%"} py={10} gap={10} overflow={"hidden"} alignItems="center" bg={"gray.700"} color={"white"}>
                    <CustomAvatar shape={"circle"} size={"lg"}
                      src={ imageRender(image)}
                      opacity={0.6} scale={1} />
                      <Flex flexDirection={"column"} width={"50%"} alignItems={"center"}>
                        <Text>{nickname}</Text>
                        <Divider color="white" w="100%"/>
                      </Flex>

                      <Flex flexDirection={"column"} width={"50%"} alignItems={"center"}>
                        <Text>{age}</Text>
                        <Divider color="white" w="100%"/>
                      </Flex>

                      <Flex flexDirection={"column"} width={"50%"} alignItems={"center"}>
                        <Text>{country}</Text>
                        <Divider color="white" w="100%"/>
                      </Flex>

                  </Card>
                </Box>
    
              </Box>
    
            </Flex>
          </Flex>
          </>
        );
}