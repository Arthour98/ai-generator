"use client"
import { Box, Flex, Text, HStack, VStack, Divider, Button, Card } from "@chakra-ui/react";
import SettingsBar from "@/components/partials/settingsBar";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import ImageUploader from "@/components/custom-components/imageUploader";
import { useState, useEffect, useRef } from "react";
import CustomInput from "@/components/custom-components/customInput";
import CustomAvatar from "@/components/custom-components/avatar";
import ColorPicker from "@/components/custom-components/colorPicker";
import { query } from "@/hooks/fetch";
import CustomSwitch from "@/components/custom-components/customSwtich";
import Matrix from "@/components/custom-components/matrix";


export default function ThemePage() {

  const { user } = useAuth();
  const [profile, setProfile] = useState();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (user)
      setUserId(user.id)
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
      setNickname(profile.nickname);
      setAge(profile.age);
      setCountry(profile.country);
      setImage(profile.image_profile);
      console.log(image);

    }
    else {
      console.log("error fetching profile");
    }
  }

  useEffect(() => {
    if (!user) return
    getProfile();
  }, [user]);



  const [image, setImage] = useState(null);
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("")

  const profileRef = useRef(null);




  return (
    <>
      <Flex direction={"row"} justifyContent={"flex-start"} overflowY="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
        <Sidebar userId={userId} />
        <Flex direction={"column"} alignItems={"center"} width={"60%"}>
          <SettingsBar />
          <Box w="100%" position padding={4} display={"flex"} border={"1px solid black"} shadow={"md"} minH={"80vh"}>
            <VStack spacing={4} w={"50%"} align="start">
              <ColorPicker w={"30px"} h={"30px"} label={"Background color"} alignItems={"end"} />
              <ColorPicker w={"30px"} h={"30px"} label={"Text color"} alignItems={"end"} />
              <CustomSwitch label="Matrix" color="white" />
            </VStack>
            <Box width={"50%"} >

              <Card height={"100%"} ref={profileRef} gap={10} overflow={"hidden"}
                alignItems="center" zIndex={30} bg={"gray.700"} style={{ position: "relative !important" }} color={"white"} position={"relative"}>
                <Matrix elem={profileRef} />i me
                <CustomAvatar shape={"circle"} zIndex={40} size={"lg"}
                  src={"https://images.saymedia-content.com/.image/t_share/MTc0OTkxMDc3NDEyNTEzNzYw/top-10-best-k-pop-girl-groups.jpg"}
                  opacity={0.6} scale={1} />
                <Flex className="z-index-60" position="relative" flexDirection={"column"} zIndex={40} width={"50%"} alignItems={"center"}>
                  <Text position={"relative"}>{nickname}</Text>
                  <Divider position={"relative"} color="white" w="100%" />
                </Flex>

                <Flex position="relative" flexDirection={"column"} width={"50%"} zIndex={40} alignItems={"center"}>
                  <Text>{age}</Text>
                  <Divider color="white" w="100%" />
                </Flex>

                <Flex position="relative" flexDirection={"column"} width={"50%"} zIndex={40} alignItems={"center"}>
                  <Text>{country}</Text>
                  <Divider color="white" w="100%" />
                </Flex>
              </Card>


            </Box>

          </Box>

        </Flex>
      </Flex>
    </>
  );
}