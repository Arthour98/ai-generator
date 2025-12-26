"use server";
import Sidebar from "@/components/partials/sidebar";
import axios from "axios";
import { cookies } from "next/headers";
import { Flex,Box, Icon } from "@chakra-ui/react";
import SettingsBar from "@/components/partials/settingsBar";
// backend URL inside Docker
const API_BASE_URL = "http://localhost:8000";


export default async function HomePage({ params }) {

  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  

  if (!refreshToken) {
    // No cookie → user not logged in
    return redirect("/login");
  }

  const res = await fetch(`${API_BASE_URL}/api/user`, {
    headers: {
      Cookie: `refresh_token=${refreshToken}`,
    },
    credentials: "include",
    cache: "no-store",
  });

  



  const user = await res.json(); // parse JSON
  const userId = user?.id;


    return (
      <>
      <Flex direction={"row"} justifyContent={"flex-start"} overflowY="hidden" alignItems={"flex-start"} gap={20} height={"100vh"}>
        <Sidebar userId={userId} />
        <Flex direction={"column"} alignItems={"center"} width={"60%"}>
            <SettingsBar />
          <Box w="100%" position  padding={4}  border={"1px solid black"} shadow={"md"} minH={"80vh"}>

          </Box>

        </Flex>
      </Flex>
      </>
    );
  }
