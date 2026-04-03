export const capitalize = (string) => {
    if (typeof string == "undefined" || typeof string == null) return;
    let cap = string[0]?.toUpperCase();
    let new_string = string.slice(1);
    return cap + new_string;
}