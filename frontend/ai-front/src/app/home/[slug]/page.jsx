"use client";
import Sidebar from "@/components/partials/sidebar";
import { Flex, Box, Icon } from "@chakra-ui/react";
import SettingsBar from "@/components/partials/settingsBar";
import { useAuth } from "@/contexts/auth";
import { useState, useEffect } from "react";
import { query } from "@/hooks/fetch";
// backend URL inside Docker
const API_BASE_URL = "http://localhost:8000";


export default function HomePage() {
  const [profile, setProfile] = useState();
  const [image, setImage] = useState();
  const { user } = useAuth();
  const userId = user?.id;

  async function getProfile() {
    const data = {
      user_id: userId
    }
    try {
      const res = await query('http://localhost:8000/api/profile/', { params: data });
      if (res) {
        const profile = res.profile
        setProfile(profile);
        setImage(profile.image_profile);
      }
      else {
        console.log("no profile")
      }
    }
    catch (e) {
      console.error('[profile]=>', e)
    }
  }

  useEffect(() => {
    if (!user) return;
    else {
      getProfile();
    }
  }, [user]);

  const imageRender = (src) => {
    if (src?.startsWith("/storage")) {
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
          <Box w="100%" position padding={4} border={"1px solid black"} shadow={"md"} minH={"80vh"}>

          </Box>

        </Flex>
      </Flex>
    </>
  );
}

