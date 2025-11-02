import { Box } from "@chakra-ui/react";


const DownloadItem = ({ data, fileName, children }) => {
    const namePrefix = (url) => {
        return url.slice(url?.length - 10, url?.length - 4)
    }


    const handleDownload = async () => {
        //
        const response = await fetch(data, { mode: "cors" });
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName + namePrefix(url) || `download/${namePrefix(url)}`;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);

    }
    return (
        <Box display={"inline-flex"} w={"auto"} height={"auto"} onClick={handleDownload}>
            {children}
        </Box>
    )
}

export default DownloadItem;