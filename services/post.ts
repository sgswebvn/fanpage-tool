import api from "./api";
import { Post } from "../interfaces/post";

interface ApiError {
    response?: {
        data?: {
            error?: string;
        };
    };
}

export const getPostsByPage = async (pageId: string): Promise<Post[]> => {
    try {
        if (!pageId || !/^[0-9_]+$/.test(pageId)) {
            throw new Error("pageId không hợp lệ");
        }
        const res = await api.get(`/posts/${pageId}`);
        if (!Array.isArray(res.data)) {
            throw new Error("Dữ liệu trả về không phải là danh sách bài đăng");
        }
        return res.data as Post[];
    } catch (error: unknown) {
        const apiError = error as ApiError;
        throw new Error(apiError.response?.data?.error || "Không thể lấy danh sách bài đăng");
    }
};