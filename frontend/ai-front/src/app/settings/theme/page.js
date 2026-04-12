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
import { useCustomToast } from "@/hooks/CustomToast";


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

  const [isLoading, setIsLoading] = useState(false);
  const showToast = useCustomToast();

  const handleUpdateSettings = useCallback(async () => {
    setIsLoading(true);
    const data = {
      user_id: userId,
      profile: profile?.id,
      matrix: openMatrix,
      background_color: backgroundColor,
      text_color: textColor
    }

    try {
      const req = await query('http://localhost:8000/api/profile/settings', { data: data, method: "post" });

      if (req) {
        const settings = req?.profile?.settings;
        setTextColor(settings?.text_color);
        setBackgroundColor(settings?.background_color);
        setOpenMatrix(settings?.matrix);
        setIsLoading(false);
        showToast({ status: "success", content: "Theme updated!" })
      }
      else {
        setIsLoading(false);
        showToast({ status: "error", content: "Error updading theme!" })
      }
    }
    catch (e) {
      setIsLoading(false);
      showToast({ status: "error", content: "Error updading theme!" })
    }
  }, [backgroundColor, textColor, openMatrix])

  const handleClear = () => {
    setBackgroundColor(null);
    setTextColor(null);
    setOpenMatrix(false);
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
      <Flex direction={{ base: "column", lg: "row" }} justifyContent={"flex-start"} overflowY="hidden"
        alignItems={"flex-start"} gap={{ base: 2, lg: 20 }} height={{ base: "auto", lg: "100vh" }}>
        <Sidebar userId={userId} />
        <Flex direction={"column"} alignItems={"center"} width={{ base: "100%", lg: "60%" }}
          rowGap={{ base: "20px", lg: "20px" }}>
          <SettingsBar ProfileImage={imageRender(image)} />
          <Box w={{ base: "90%", lg: "100%" }} position padding={{ base: 6, lg: 4 }}
            display={"flex"} flexDirection={{ base: "column", lg: "row" }} bg={"blackAlpha.800"}
            border={"1px solid black"} shadow={"md"} rowGap={{ base: "3rem", lg: "0" }}
            minH={{ base: "80vh", lg: "80vh" }} borderRadius={12} justifyContent={{ base: "center", lg: "start" }}
          >
            <VStack spacing={4} w={{ base: "100%", lg: "50%" }} align={"start"} >
              <CustomSkeleton loading={loading} w={{ base: "90%", md: "400px" }}>
                <ColorPicker w={"25px"} h={"25px"} label={"Background color"} alignItems={"end"}
                  value={backgroundColor} initialColor={backgroundColor} setValue={setBackgroundColor} />
                <ColorPicker w={"25px"} h={"25px"} label={"Text color"} alignItems={"end"}
                  value={textColor} initialColor={textColor} setValue={setTextColor} />
                <CustomSwitch label="Matrix" color="white" value={openMatrix} setValue={() => setOpenMatrix(!openMatrix)} />
              </CustomSkeleton>
              <HStack spacing={4} height={{ base: "auto", lg: 100 }} flexWrap={{ base: "wrap", lg: "nowrap" }}>
                <Button onClick={handleClear} color="white" bg={"gray.400"} _hover={{ bg: "gray.600" }}>
                  Clear
                </Button>
                <Button isLoading={isLoading} onClick={handleUpdateSettings} color="white" bg={"green.400"} _hover={{ bg: "green.600" }}>
                  Save
                </Button>
              </HStack>
            </VStack>
            <Box width={{ base: "100%", lg: "50%" }} >

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
                <Flex className="z-index-60" position="relative" flexDirection={"column"} zIndex={40} width={{ base: "80%", md: "60%", lg: "50%" }} alignItems={"center"}>
                  <CustomSkeleton loading={loading} w={{ base: "90%", md: "400px" }} h={20}>
                    <Text position={"relative"}>{nickname}</Text>
                    <Divider position={"relative"} color="white" w="100%" />
                  </CustomSkeleton>
                </Flex>

                <Flex position="relative" flexDirection={"column"} width={{ base: "80%", md: "60%", lg: "50%" }} zIndex={40} alignItems={"center"}>
                  <CustomSkeleton loading={loading} w={{ base: "90%", md: "400px" }} h={20}>
                    <Text>{age}</Text>
                    <Divider color="white" w="100%" />
                  </CustomSkeleton>
                </Flex>

                <Flex position="relative" flexDirection={"column"} width={{ base: "80%", md: "60%", lg: "50%" }} zIndex={40} alignItems={"center"}>
                  <CustomSkeleton loading={loading} w={{ base: "90%", md: "400px" }} h={20}>
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