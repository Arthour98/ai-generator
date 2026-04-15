
export const nameShortener = (str, length = 12) => {
    let newStr;
    if (str?.length >= 12) {
        let newStr = str?.slice(0, length - 1) + "...";
        return newStr
    }
    else {
        return str?.slice(0, length - 1);
    }
}