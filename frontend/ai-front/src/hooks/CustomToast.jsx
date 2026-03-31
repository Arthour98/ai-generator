import { useToast } from "@chakra-ui/react";

export function useCustomToast() {
    const toast = useToast();
    const id = "current";

    const showToast = ({ status, content }) => {
        if (toast.isActive(id)) return;

        toast({
            id,
            title: content,
            status,
            isClosable: true,
            duration: 3000,
            position: "bottom-right",
        });
    };

    return showToast;
}