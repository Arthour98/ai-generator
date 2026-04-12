"use client";
import { Box, Icon, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import CustomAvatar from "@/components/custom-components/avatar";
import { IoIosSettings } from "react-icons/io";
import { useLayoutEffect, useState } from "react";
import NavLink from "./NavLink";
import { faRightFromBracket, faBars, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/contexts/auth";
import { isMobile } from "@/hooks/isMobile";
import MobileSidebar from "./mobileNav";
import { usePathname } from "next/navigation";



const fadeIn = keyframes`
  from {
    height:0;
  }
  to {
    height:150px;
  }
`;

const fadeOut = keyframes`
  from {
    height:150px;
  }
  to {
    height: 0;
  }
`;

export default function SettingsBar({ ProfileImage, openMobileFriendsBar }) {
  const { logout } = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const pathname = usePathname();
  const mobile = isMobile();

  const handleHover = () => {
    setIsHovering(true);
  }

  const openDropDownMenu = (openDropDown) => {
    if (!hasInteracted) setHasInteracted(true);
    setOpenDropDown(!openDropDown);
  }

  const [menuHover, setMenuHover] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const [renderFriendIcon, setRenderFriendIcon] = useState(false);
  const [renderFriendBar, setRenderFriendBar] = useState(false);

  useLayoutEffect(() => {
    if (mobile && pathname == "/chat-room") {
      setRenderFriendIcon(true);
    }
  }, [mobile, pathname]);

  const handleOpen = (data) => {
    if (data) {
      openMobileFriendsBar(data)
    }
  }


  return (
    <Box height={100} w={"100%"} display={"flex"} alignItems={"center"} gap={8} >
      <CustomAvatar shape={"circle"} size={"lg"} src={ProfileImage} opacity={0.6} scale={1} />
      <Box height={"50px"} display={"flex"} alignItems="center" position="relative" >
        <Icon as={IoIosSettings} width={50}
          _hover={isHovering ? { transform: "scale(1.2)", color: "gray.300" } : {}} height={40}
          color={"white"} cursor={"pointer"}
          onMouseEnter={() => handleHover()}
          onClick={() => openDropDownMenu(openDropDown)} />

        <Box position="absolute" top="100%" left={0}
          display={"flex"} justifyContent={"center"} flexDirection={"column"}
          gap={1.5} px={4} borderRadius={12} bg="white" boxShadow="md"
          backgroundColor={"purple.300"} width={200} flexWrap={"nowrap"}
          animation={hasInteracted ? `${openDropDown ? fadeIn : fadeOut} 0.5s linear forwards` : 'none'}
          height={hasInteracted ? 'auto' : '0px'}
          overflow={"hidden"}
          zIndex={200}
          visibility={!hasInteracted && !openDropDown ? 'hidden' : 'visible'}
        >
          <NavLink href="/settings/profile">Profile-settings</NavLink>
          <NavLink href="/settings/account">Account-settings</NavLink>
          <NavLink href="/settings/theme">Theme</NavLink>
          <Flex gap={"1rem"} alignItems="center"
            cursor="pointer" _hover={{ color: "white" }} height="30px"
            onClick={logout}
          >
            <Text>Logout</Text><FontAwesomeIcon icon={faRightFromBracket} />
          </Flex>
        </Box>

      </Box>
      {mobile ?
        <Box
          onMouseEnter={() => setMenuHover(true)}
          onMouseLeave={() => setMenuHover(false)}
          onClick={() => setOpenMenu(true)}
        >
          <FontAwesomeIcon icon={faBars} style={{
            width: "2.5rem",
            height: "2.5rem",
            color: "white",
            cursor: "pointer",
            opacity: menuHover ? "0.7" : "1"
          }} />
        </Box>
        : null
      }
      {
        renderFriendIcon ?
          <FontAwesomeIcon
            onClick={() => handleOpen(true)}
            icon={faUserGroup} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            width={"50px"} height="50px" cursor="pointer" color="gray"
            style={{
              padding: "0.3rem",
              backgroundColor: "transparent",
              borderRadius: "6px",
              color: "white",
              height: "2.3rem",
              width: "2.3rem"
            }} /> : null
      }
      <MobileSidebar isOpen={openMenu} onClose={() => setOpenMenu(false)} />
    </Box>
  )
}