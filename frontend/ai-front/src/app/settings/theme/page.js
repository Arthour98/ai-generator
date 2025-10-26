"use client"
import { Box, Flex, Text, HStack, VStack, Divider, Button, Card } from "@chakra-ui/react";
import SettingsBar from "@/components/partials/settingsBar";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import ImageUploader from "@/components/custom-components/imageUploader";
import { useState, useEffect, useRef, useCallback } from "react";
import CustomInput from "@/components/custom-components/customInput";
import CustomAvatar from "@/components/custom-components/avatar";
import ColorPicker from "@/components/custom-components/colorPicker";
import { query } from "@/hooks/fetch";
import CustomSwitch from "@/components/custom-components/customSwtich";
import Matrix from "@/components/custom-components/matrix";
import CustomSkeleton from "@/components/custom-components/skeleton";


export default function ThemePage() {

  const { user } = useAuth();
  const [profile, setProfile] = useState();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

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
      const settings = res.profile?.settings;
      setProfile(profile);
      setNickname(profile.nickname);
      setAge(profile.age);
      setCountry(profile.country);
      setImage(profile.image_profile);
      setBackgroundColor(settings?.background_color);
      setTextColor(settings?.text_color);
      setOpenMatrix(settings?.matrix);
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




  const [image, setImage] = useState("");
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("")
  const [openMatrix, setOpenMatrix] = useState(false);
  const profileRef = useRef(null);
  const [textColor, setTextColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);

  const handleUpdateSettings = useCallback(async () => {
    const data = {
      user_id: userId,
      profile: profile?.id,
      matrix: openMatrix,
      background_color: backgroundColor,
      text_color: textColor
    }

    const req = await query('http://localhost:8000/api/profile/settings', { data: data, method: "post" });

    if (req) {
      const settings = req?.profile?.settings;
      setTextColor(settings?.text_color);
      setBackgroundColor(settings?.background_color);
      setOpenMatrix(settings?.matrix);
    }
  }, [backgroundColor, textColor, openMatrix])

  const handleClear = () => {
    setBackgroundColor(null);
    setTextColor(null);
    setOpenMatrix(!openMatrix)
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
          <Box w="100%" position padding={4}
            display={"flex"} bg={"blackAlpha.800"}
            border={"1px solid black"} shadow={"md"}
            minH={"80vh"} borderRadius={12}
          >
            <VStack spacing={4} w={"50%"} align="start">
              <CustomSkeleton loading={loading} w={400}>
                <ColorPicker w={"25px"} h={"25px"} label={"Background color"} alignItems={"end"}
                  value={backgroundColor} initialColor={backgroundColor} setValue={setBackgroundColor} />
                <ColorPicker w={"25px"} h={"25px"} label={"Text color"} alignItems={"end"}
                  value={textColor} initialColor={textColor} setValue={setTextColor} />
                <CustomSwitch label="Matrix" color="white" value={openMatrix} setValue={() => setOpenMatrix(!openMatrix)} />
              </CustomSkeleton>
              <HStack spacing={4} height={100}>
                <Button onClick={handleClear} color="white" bg={"gray.400"} _hover={{ bg: "gray.600" }}>
                  Clear
                </Button>
                <Button onClick={handleUpdateSettings} color="white" bg={"green.400"} _hover={{ bg: "green.600" }}>
                  Save
                </Button>
              </HStack>
            </VStack>
            <Box width={"50%"} >

              <Card height={"100%"} ref={profileRef} gap={10} overflow={"hidden"}
                alignItems="center" zIndex={30} bg={backgroundColor ?? "gray.700"}
                style={{ position: "relative !important" }} color={"white"}
                position={"relative"} textColor={textColor} py={10} borderRadius={12}>
                {openMatrix ?
                  <Matrix elem={profileRef} start={openMatrix} />
                  :
                  null
                }
                <CustomAvatar shape={"circle"} position={"relative"} zIndex={60} size={"lg"}
                  src={imageRender(image)}
                  opacity={1} scale={1} />
                <Flex className="z-index-60" position="relative" flexDirection={"column"} zIndex={40} width={"50%"} alignItems={"center"}>
                  <CustomSkeleton loading={loading} w={400} h={20}>
                    <Text position={"relative"}>{nickname}</Text>
                    <Divider position={"relative"} color="white" w="100%" />
                  </CustomSkeleton>
                </Flex>

                <Flex position="relative" flexDirection={"column"} width={"50%"} zIndex={40} alignItems={"center"}>
                  <CustomSkeleton loading={loading} w={400} h={20}>
                    <Text>{age}</Text>
                    <Divider color="white" w="100%" />
                  </CustomSkeleton>
                </Flex>

                <Flex position="relative" flexDirection={"column"} width={"50%"} zIndex={40} alignItems={"center"}>
                  <CustomSkeleton loading={loading} w={400} h={20}>
                    <Text>{country}</Text>
                    <Divider color="white" w="100%" />
                  </CustomSkeleton>
                </Flex>
              </Card>


            </Box>

          </Box>

        </Flex>
      </Flex>
    </>
  );
}