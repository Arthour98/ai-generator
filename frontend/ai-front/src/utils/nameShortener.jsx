
export const nameShortener = (str) => {
    let newStr;
    if (str.length >= 12) {
        let newStr = str?.slice(1, 9) + "...";
        return newStr
    }
    else {
        return str;
    }
}