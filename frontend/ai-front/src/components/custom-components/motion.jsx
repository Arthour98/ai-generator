import { motion } from "framer-motion";


const Motion = ({ children, ...props }) => {

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={props.open ? { opacity: 1, scale: 1 } :
                { opacity: 0, scale: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: props.duration || 0.8, ease: "easeInOut" }}
            style={{ width: props.w ? props.w : "100%", height: props.h ? props.h : "100%" }}
        >
            {children}
        </motion.div>
    )
}

export default Motion;