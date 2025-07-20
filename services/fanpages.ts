import api from "./api";
import { Fanpage } from "../interfaces/fanpage";

interface ApiError {
    response?: {
        data?: {
            error?: string;
        };
    };
}

export const getFacebookPages = async (): Promise<Fanpage[]> => {
    try {
        const res = await api.get("/auth/facebook/pages");
        if (!Array.isArray(res.data)) {
            throw new Error("Dữ liệu trả về không phải là danh sách Fanpage");
        }
        return res.data as Fanpage[];
    } catch (error: unknown) {
        const apiError = error as ApiError;
        throw new Error(apiError.response?.data?.error || "Không thể lấy danh sách Fanpage");
    }
};

export const connectPage = async (pageId: string, name: string, access_token: string): Promise<Fanpage> => {
    try {
        const res = await api.post("/pages/connect", { pageId, name, access_token });
        return res.data as Fanpage;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        throw new Error(apiError.response?.data?.error || "Không thể kết nối Fanpage");
    }
};

export const getConnectedPages = async (): Promise<Fanpage[]> => {
    try {
        const res = await api.get("/pages?connected=true");
        if (!Array.isArray(res.data)) {
            throw new Error("Dữ liệu trả về không phải là danh sách Fanpage");
        }
        return res.data as Fanpage[];
    } catch (error: unknown) {
        const apiError = error as ApiError;
        throw new Error(apiError.response?.data?.error || "Không thể lấy danh sách Fanpage đã kết nối");
    }
};
// export consnt disconnectPage