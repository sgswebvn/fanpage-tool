import api from "./api";
export const getPostsByPage = async (pageId: string) => {
    const res = await api.get(`/posts/${pageId}`);
    return res.data;
};