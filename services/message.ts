import api from "./api";

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: string;
    direction: "in" | "out";
    avatar?: string;
    followed?: boolean;
}

interface CustomerInfo {
    id: string;
    name: string;
    picture?: { data: { url: string } };
}

interface Conversation {
    conversationId: string;
    customerInfo: CustomerInfo | null;
    messages: Message[];
}

export const getMessagesByPage = async (pageId: string): Promise<Conversation[]> => {
    try {
        if (!pageId || !/^[0-9_]+$/.test(pageId)) {
            throw new Error("pageId không hợp lệ");
        }
        const res = await api.get(`/messages/fb/${pageId}`);
        if (!Array.isArray(res.data)) {
            throw new Error("Dữ liệu trả về không phải là danh sách hội thoại");
        }
        return res.data as Conversation[];
    } catch (error: any) {
        console.error("Error fetching messages:", error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Không thể lấy danh sách hội thoại");
    }
};