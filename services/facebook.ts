import api from "./api";

export const getFacebookAuthUrl = async (): Promise<string> => {
    const res = await api.get("/auth/facebook/");
    return res.data.url;
};

const handleConnectFacebook = () => {
    window.location.href = "https://tool-fb.onrender.com/auth/facebook";
};