import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import * as React from "react";

export const Tooltip = React.forwardRef(function Tooltip(props, ref) {
    const {
        showArrow,
        children,
        disabled,
        portalled = true,
        content,
        portalRef,
        ...rest
    } = props;

    if (disabled) return children;

    const tooltipElement = (
        <ChakraTooltip
            label={content}
            hasArrow={showArrow}
            shouldWrapChildren
            sx={ref}
            {...rest}
        >
            {children}
        </ChakraTooltip>
    );


    return tooltipElement;
});