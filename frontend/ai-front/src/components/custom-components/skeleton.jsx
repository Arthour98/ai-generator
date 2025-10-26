import { Skeleton } from "@chakra-ui/react";


function Skeleton({ asChild, className, loading }) {


    return (
        <>
            <Skeleton asChild={asChild}
                className={className}
                variant="pulse"
                colorPalete="cyan"
                loading={loading}
            />
        </>
    )
}

export default Skeleton;

