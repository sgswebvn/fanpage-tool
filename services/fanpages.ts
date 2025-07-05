// services/fanpage.ts
import api from "./api";

export const getFacebookPages = async () => {
    const res = await api.get("/auth/facebook/pages");
    return res.data; // [{ pageId, name, access_token }]
};
export const connectPage = async (pageId: string, name: string, access_token: string) => {
    const res = await api.post("/pages/connect", { pageId, name, access_token });
    return res.data;
};
export const getConnectedPages = async () => {
    const res = await api.get("/pages");
    return res.data; // [{ pageId, name, connected }]
};