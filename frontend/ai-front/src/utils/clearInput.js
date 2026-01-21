

export const clearInput = (input, setInput) => {
    if (!input || input?.length == 0) return;
    let t = setInterval(() => {
        setInput(prev => {
            if (prev?.length > 0) {
                return prev?.slice(0, -1);
            }
            else {
                clearInterval(t);
                return "";
            }
        }
        )
    }, 50);
}
