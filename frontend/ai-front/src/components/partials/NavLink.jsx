import {useState} from "react";
import {Flex,Link,Text} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Icon } from "@chakra-ui/react";

const NavLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  return (
    <Link
      href={href}
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
