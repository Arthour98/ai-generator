"use client"
import { Box, Flex, Text, HStack, VStack, Divider, Button, Card } from "@chakra-ui/react";
import SettingsBar from "@/components/partials/settingsBar";
import Sidebar from "@/components/partials/sidebar";
import { useAuth } from "@/contexts/auth";
import ImageUploader from "@/components/custom-components/imageUploader";
import { useState, useEffect, useCallback, useRef } from "react";
import CustomInput from "@/components/custom-components/customInput";
import CustomAvatar from "@/components/custom-components/avatar";
import { query } from "@/hooks/fetch";
import Matrix from "@/components/custom-components/matrix";
import CustomSkeleton from "@/components/custom-components/skeleton";
import { useCustomToast } from "@/hooks/CustomToast";






export default function ProfileSettingsPage() {

  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const userId = user?.id;
  const profileRef = useRef(null);

  const [loading, setLoading] = useState(true); //helper state for fallbacks skeletons

  const [isFocused, setIsFocused] = useState(false);

  const [image, setImage] = useState("");
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("")
  const [openMatrix, setOpenMatrix] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [textColor, setTextColor] = useState(null)

  const [isLoading, setIsLoading] = useState(false);

  const showToast = useCustomToast();

  useEffect(() => {
    if (profile !== null) {
      setLoading(false);
    }
    else if (profile === "empty") {
      setLoading(false);
    }
  }, [profile]);

  const createProfile = useCallback(async () => {
    let UserId = user?.id;
    setIsLoading(true);
    const data =
    {
      user_id: UserId,
      nickname: nickname,
      age: age,
      country: country,
      image_profile: image
    }
    const res = await query('http://localhost:8000/api/profile/create', { data: data, method: "post" });
    if (res) {
      setProfile(res.profile)
      setIsLoading(false);
      showToast({ status: "success", content: "Profile updated!" })
    }
    else {
      setIsLoading(false);
      showToast({ status: "error", content: "Error while updating profile!" })
    }
  }, [age, country, nickname, image]);

  const submitOnEnter = useCallback((e) => {
    if (!isFocused) return
    if (e.key === "Enter") {
      createProfile();
      setIsFocused(false);
    }
    else {
      return;
    }
  }, [isFocused, createProfile])

  useEffect(() => {
    if (typeof window == "undefined") return;
    document.addEventListener("keydown", submitOnEnter);
    return () => document.removeEventListener("keydown", submitOnEnter);
  }, [submitOnEnter])

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
    }
    else {
      setProfile("empty");
    }
  }

  useEffect(() => {
    if (!user) return
    getProfile();
  }, [user]);

  {/* function to render image correctly whether it's a local storage path or a URL */ }
  const imageRender = (src) => {
    if (src) {
      if (src.startsWith("/storage")) {
        return `http://localhost:8000${src}`;
      }
      else {
        return src;
      }
    }
    else {
      return;
    }
  }

  const handleClear = () => {
    setNickname('');
    setAge('');
    setCountry('');
  }





  return (
    <>
      <Flex direction={{ base: "column", lg: "row" }} justifyContent={"flex-start"}
        overflowY="hidden" alignItems={"flex-start"} gap={{ base: 2, lg: 20 }} height={{ base: "auto", lg: "100vh" }}>
        <Sidebar userId={userId} />
        <Flex direction={"column"} alignItems={"center"} width={{ base: "100%", lg: "60%" }}
        rowGap={{ base: "20px", lg: "20px" }}>
          <SettingsBar ProfileImage={imageRender(image)} />
          <Box w={{ base: "90%", lg: "100%" }} position padding={{ base: 6, lg: 4 }} rowGap={{ base: "20px" }}
            display={"flex"} flexDirection={{ base: "column", lg: "row" }}
            borderRadius={12} color={"white"} bg={"blackAlpha.800"} border={"1px solid black"} shadow={"md"}
            minH={{ base: "auto", lg: "80vh" }}>
            <VStack spacing={4} w={{ base: "100%", lg: "50%" }} align="start">
              <Text fontSize="2xl" fontWeight="bold">Profile Settings</Text>
              <HStack spacing={4} align="center">
                <Text fontSize="lg" fontWeight="semibold">Image profile </Text>
                <ImageUploader value={imageRender(image)} setValue={setImage} shape="circle" />
              </HStack>
              <Divider width={{ base: "90%", md: "50%" }} />
              <HStack flexWrap={{ base: "wrap", lg: "nowrap" }}>
                <CustomSkeleton w={{ base: "90%", md: "300px" }} h={10} loading={loading}>
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
                    w={{ base: "90%", md: "300px" }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </CustomSkeleton>
              </HStack>
              <Divider width={{ base: "90%", md: "50%" }} />
              <HStack flexWrap={{ base: "wrap", lg: "nowrap" }}>
                <CustomSkeleton w={{ base: "90%", md: "300px" }} h={10} loading={loading}>
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
                    w={{ base: "90%", md: "300px" }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </CustomSkeleton>
              </HStack>
              <Divider width={{ base: "90%", md: "50%" }} />
              <HStack flexWrap={{ base: "wrap", lg: "nowrap" }}>
                <CustomSkeleton w={{ base: "90%", md: "300px" }} h={10} loading={loading}>
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
                    w={{ base: "90%", md: "300px" }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </CustomSkeleton>
              </HStack>
              <Divider width={{ base: "90%", md: "50%" }} />
              <HStack spacing={4} height={{ base: "auto", lg: 100 }} flexWrap={{ base: "wrap", lg: "nowrap" }}>
                <Button onClick={handleClear} color="white" bg={"gray.400"} _hover={{ bg: "gray.600" }}>
                  Clear
                </Button>
                <Button isLoading={isLoading} onClick={createProfile} color="white" bg={"green.400"} _hover={{ bg: "green.600" }}>
                  Save
                </Button>
              </HStack>
            </VStack>
            <Box width={{ base: "100%", lg: "50%" }} >
              <Card height={"100%"}
                py={10} gap={10}
                overflow={"hidden"}
                alignItems="center"
                bg={backgroundColor ?? "gray.700"}
                color={textColor ?? "white"}
                ref={profileRef} zIndex={30}
                borderRadius={12}
              >
                {openMatrix && <Matrix elem={profileRef} start={openMatrix} />}
                <CustomAvatar shape={"circle"} size={"lg"}
                  src={imageRender(image)}
                  opacity={0.6} scale={1}
                  zIndex={60}
                />

                <Flex flexDirection={"column"} width={{ base: "80%", md: "60%", lg: "50%" }} alignItems={"center"}>
                  <CustomSkeleton w={{ base: "90%", md: "300px" }} h={30} loading={loading}>
                    <Text>{nickname}</Text>
                    <Divider color="white" w="100%" />
                  </CustomSkeleton>
                </Flex>



                <Flex flexDirection={"column"} width={{ base: "80%", md: "60%", lg: "50%" }} alignItems={"center"}>
                  <CustomSkeleton w={{ base: "90%", md: "300px" }} h={30} loading={loading}>
                    <Text>{age}</Text>
                    <Divider color="white" w="100%" />
                  </CustomSkeleton>
                </Flex>



                <Flex flexDirection={"column"} width={{ base: "80%", md: "60%", lg: "50%" }} alignItems={"center"}>
                  <CustomSkeleton w={{ base: "90%", md: "300px" }} h={30} loading={loading}>
                    <Text >{country}</Text>
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