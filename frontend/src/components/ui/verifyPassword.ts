

export const verifyPassword = (password:string) => {
    if(!password) return false;
    if(typeof(password) !== "string") return false;
    if(password.length < 6) return false;
    return true;
}