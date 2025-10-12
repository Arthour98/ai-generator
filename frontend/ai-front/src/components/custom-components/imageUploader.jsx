import {useState,useRef} from "react";
import { Box,Icon  } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { VisuallyHidden } from "@chakra-ui/react";

export default function ImageUploader({value,setValue,shape})
{
    
const inputRef=useRef(null);

const trigger=()=>
{
    inputRef.current?.click();
}

const handleFileChange=(event)=>
{
    setValue(null);
    const file=event.target.files[0];
    if(file)
    {
        const reader=new FileReader();
        reader.onloadend=()=>
        {
            setValue(reader.result);
        }
        reader.readAsDataURL(file);
    }
}




    return(
        <Box 
            onClick={trigger}
            width={'60px'}
            height={'60px'}
            border={"1px solid white"}
            
            borderRadius={shape==="circle"?"50%":"12px"}
            overflow={"hidden"}
            cursor={"pointer"}
            >
        {value ? 
            <img
            src={value}   // base64 works here
            alt="preview"
            style={{ width: "100%", height: "100%",
            objectFit: "cover",display:"block" }}
            />
            :
            <Icon as={FaUserCircle} w="100%" h="100%" color="gray.300" />
            
        }

            <input style={{visibility:"hidden"}} ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} />

        </Box>
    )
}
