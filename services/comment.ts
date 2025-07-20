import api from "./api";
import { Comment } from "../interfaces/comment";

// Biểu thức chính quy để phát hiện số điện thoại (định dạng Việt Nam)
const phoneNumberRegex = /(?:\+84|0)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}\b/;

export const getCommentsByPost = async (postId: string, page: number = 1, limit: number = 10): Promise<Comment[]> => {
    try {
        const response = await api.get(`/comments/${postId}`, {
            params: { page, limit },
        });
        const comments: Comment[] = response.data.map((c: any) => ({
            commentId: c.id,
            from: c.from?.name,
            picture: c.from?.picture?.data?.url,
            message: c.message,
            created_time: c.created_time,
            attachments: c.attachment ? [{ type: c.attachment.type, url: c.attachment.url }] : undefined,
            hidden: c.hidden || false,
            parent_id: c.parent?.id,
            containsPhoneNumber: phoneNumberRegex.test(c.message),
        }));
        return comments;
    } catch (error: any) {
        if (error.response?.status === 400) {
            throw new Error("Không thể lấy bình luận từ Facebook. Vui lòng kiểm tra ID bài viết hoặc quyền truy cập.");
        }
        throw new Error(error.response?.data?.message || "Lỗi khi lấy bình luận");
    }
};

export const createComment = async (postId: string, message: string, parentId?: string): Promise<{ data: any }> => {
    try {
        const response = await api.post(`/comments/${postId}`, { message, parentId });
        return response.data; // Trả về dữ liệu bình luận mới từ server
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Lỗi khi tạo bình luận");
    }
};

export const hideComment = async (commentId: string, hidden: boolean): Promise<void> => {
    try {
        await api.post(`/comments/${commentId}/hide`, { hidden });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || `Lỗi khi ${hidden ? "ẩn" : "hiện"} bình luận`);
    }
};

export const detectPhoneNumber = (message: string): boolean => {
    return phoneNumberRegex.test(message);
};