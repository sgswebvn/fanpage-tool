import api from "./api";
import { Post } from "../interfaces/post";
export const getPostsByPage = async (pageId: string): Promise<Post[]> => {
    try {
        const res = await api.get(`/posts/${pageId}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Không thể lấy bài đăng từ Fanpage");
    }
};