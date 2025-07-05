export interface Message {
    _id: string;
    senderId: string;
    recipientId: string;
    pageId: string;
    message: string;
    direction: "in" | "out";
    timestamp: string;
    followed?: boolean;
}