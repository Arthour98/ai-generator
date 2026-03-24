import { useState } from "react";
import { Flex, Link, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Icon } from "@chakra-ui/react";

const NavLink = ({ href, children, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault(); // reason behind this is because this route works on userId
          // userId come with polling so , we have to prevent early navigation there
        }
      }
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: pathname === href ? "white" : "gray.500",
        textDecoration: "none",
      }}
      _hover={{ color: "white" }}
    >
      <Flex gap={4} alignItems={"center"}>
        {children}
      </Flex>
    </Link>
  );
};

export default NavLink;
