import api from "./api";
export const getMessagesByPage = async (pageId: string) => {
    const res = await api.get(`/messages/fb/${pageId}`);
    return res.data; // [{ conversationId, messages: [...] }]
};