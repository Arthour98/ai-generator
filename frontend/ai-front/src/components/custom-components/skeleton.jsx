import { Skeleton } from "@chakra-ui/react";


function CustomSkeleton({ w, h, className, loading, children, startColor = "cyan.900", endColor = "cyan.900" }) {

    return (
        <>
            {loading ?
                <Skeleton
                    w={w}
                    h={h}
                    className={className}
                    isLoaded={!loading}
                    startColor={startColor}
                    borderRadius={12}
                    endColor={endColor}
                    speed={1}
                    top="0"
                    zIndex={10}
                    opacity={1}
                >
                    {children}
                </Skeleton> : children}
        </>

    )
}

export default CustomSkeleton;

