
export const nameShortener = (str, length = 12) => {
    let newStr;
    if (str?.length >= 12) {
        let newStr = str?.slice(1, length - 1) + "...";
        return newStr
    }
    else {
        return str?.slice(1, length - 1);
    }
}