// services/comment.ts
import api from "./api";

export interface Comment {
    commentId: string;
    postId: string;
    message: string;
    from: string;
    created_time: string;
    parent_id?: string;
}

export const syncComments = async (pageId: string, postId: string): Promise<Comment[]> => {
    try {
        const res = await api.get(`/posts/${pageId}/${postId}/comments`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Không thể đồng bộ bình luận từ Facebook");
    }
};

export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
    try {
        const res = await api.get(`/comments/${postId}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Không thể lấy bình luận");
    }
};

export const createComment = async (postId: string, message: string, parentId?: string): Promise<Comment> => {
    try {
        const res = await api.post(
            `/comments/${postId}`,
            parentId ? { message, parentId } : { message }
        );
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || "Không thể tạo bình luận");
    }
};