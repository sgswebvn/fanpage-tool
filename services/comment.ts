import api from "./api";
export const getCommentsByPost = async (postId: string) => {
    const res = await api.get(`/comments/${postId}`);
    return res.data;
};