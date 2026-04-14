
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const imageRender = (src) => {
    if (src) {
        if (src?.startsWith("/storage")) {
            return `${API_BASE_URL}${src}`;
        }
        else {
            return src;
        }
    }
    else {
        return;
    }
}