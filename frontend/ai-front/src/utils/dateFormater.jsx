
export const dateFormater = (date) => {
    const newDate = new Date(date);
    const formated =
        newDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }) +
        "/" +
        newDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    return formated
}