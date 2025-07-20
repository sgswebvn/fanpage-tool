import api from "./api";

export const getFacebookAuthUrl = async (): Promise<string> => {
    try {
        const res = await api.get("/auth/facebook");
        if (!res.data?.url || typeof res.data.url !== "string") {
            throw new Error("URL xác thực không hợp lệ");
        }
        return res.data.url;
    } catch (error: any) {
        console.error("Lỗi khi lấy URL xác thực:", error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Không thể lấy URL xác thực Facebook");
    }
};