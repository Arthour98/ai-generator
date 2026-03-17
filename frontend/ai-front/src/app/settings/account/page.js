"use client";
import { Box, Flex, Text, HStack, VStack, Divider, Button, Card } from "@chakra-ui/react";
import SettingsBar from "@/components/partials/settingsBar";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import { useState, useEffect, useCallback } from "react";
import CustomInput from "@/components/custom-components/customInput";
import { query } from "@/hooks/fetch";
import CustomSkeleton from "@/components/custom-components/skeleton";


export default function AccountSettingsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState();
  const [image, setImage] = useState("");

  const [isLoading, setIsLoading] = useState(false); // loader for button
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (user) {
      setUsername(user?.name);
      setUserId(user?.id);
      setEmail(user?.email);
    }
  }, [user])

  const getProfile = async () => {
    const userId = user?.id;
    const data = {
      user_id: userId
    }
    const res = await query("http://localhost:8000/api/profile", { params: data })
    if (res) {
      const profile = res.profile;
      setProfile(profile);
      setImage(profile.image_profile);
      setLoading(false);
    }
    else {
      console.log("error fetching profile");
    }
  }

  useEffect(() => {
    if (!user) return
    getProfile();
  }, [user]);


  const handleSave = useCallback(async () => {
    setIsLoading(true)
    const userId = user?.id;
    const data = {
      user_id: userId,
      username: username,
      email: email,
      password: password
    }
    try {
      const res = await query(`/api/user/edit`, { data: data, method: "post" });
      if (res.ok) {
        setIsLoading(false);
      }
    }
    catch (e) {
      console.error("[Error]->", e);
      if (e) {
        setIsLoading(false);
      }
    }
    finally {
      let t = setTimeout(() => {
        setIsLoading(false);
        return () => clearTimeout(t);
      }, 7000);
    }
  }, [username, password, email]);

  const submitOnEnter = useCallback((e) => {
    if (!isFocused) return;
    if (e.key == "Enter") {
      handleSave();
      setIsFocused(false);
    }
    else {
      return;
    }
  }, [isFocused, handleSave]);

  useEffect(() => {
    if (typeof window == "undefined") return;
    document.addEventListener("keydown", submitOnEnter);
    return () => document.removeEventListener("keydown", submitOnEnter);
  }, [submitOnEnter]);



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




  const handleClear = () => {
    setEmail('');
    setUsername('');
    setPassword('');
  }


  const imageRender = (src) => {
    if (src.startsWith("/storage")) {
      return `http://localhost:8000${src}`;
    }
    else {
      return src;
    }
  }


  return (
    <>
      <Flex direction={"row"} justifyContent={"flex-start"} overflowY="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
        <Sidebar userId={userId} />
        <Flex direction={"column"} alignItems={"center"} width={"60%"}>
          <SettingsBar ProfileImage={imageRender(image)} />
          <Box w="100%" borderRadius={12} padding={4} color={"white"} bg={"blackAlpha.800"} display={"flex"} border={"1px solid black"} shadow={"md"} minH={"80vh"}>
            <VStack spacing={4} w={"100%"} align="center">
              <Text fontSize="2xl" fontWeight="bold">Account Settings</Text>
              <VStack spacing={4} w="100%" align="center">
                <HStack>
                  <CustomSkeleton loading={loading} w={300} h={10}>
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
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                  </CustomSkeleton>
                </HStack>
                <Divider width={"50%"} />
                <HStack>
                  <CustomSkeleton loading={loading} w={300} h={10}>
                    <CustomInput
                      placeholder={"Password"}
                      value={password}
                      setValue={setPassword}
                      paddingX={4}
                      paddingY={2}
                      label={"Password"}
                      horizontal
                      textColor={"white"}
                      h={"30px"}
                      bgColor={"black"}
                      w={"300px"}
                      type="password"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                  </CustomSkeleton>
                </HStack>
                <Divider width={"50%"} />
                <HStack>
                  <CustomSkeleton loading={loading} w={300} h={10}>
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
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                  </CustomSkeleton>
                </HStack>
                <Divider width={"50%"} />
                <HStack spacing={4} height={100}>
                  <Button onClick={handleClear} color="white" bg={"gray.400"} _hover={{ bg: "gray.600" }}>
                    Clear
                  </Button>
                  <Button onClick={handleSave} color="white" bg={"green.400"} _hover={{ bg: "green.600" }}
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </HStack>
              </VStack>

            </VStack>
          </Box>

        </Flex>
      </Flex>
    </>
  );
}