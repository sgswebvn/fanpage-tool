import api from "./api";

export const getCommentsByPost = async (postId: string) => {
    const res = await api.get(`/comments/${postId}`);
    return res.data;
};

export const createComment = async (postId: string, message: string, parentId?: string) => {
    const res = await api.post(`/comments/${postId}`,
        parentId ? { message, parentId } : { message }
    );
    return res.data;
};