// services/fanpages.ts
import api from "./api";
import { Fanpage } from "../interfaces/post";

export const getFacebookPages = async (): Promise<Fanpage[]> => {
    try {
        const res = await api.get("/auth/facebook/pages");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Không thể lấy danh sách Fanpage");
    }
};

export const connectPage = async (pageId: string, name: string, access_token: string): Promise<Fanpage> => {
    try {
        const res = await api.post("/pages/connect", { pageId, name, access_token });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Không thể kết nối Fanpage");
    }
};

export const getConnectedPages = async (): Promise<Fanpage[]> => {
    try {
        const res = await api.get("/pages");
        const pages = res.data as Fanpage[];
        return pages.filter(page => page.connected); 
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Không thể lấy danh sách Fanpage đã kết nối");
    }
};