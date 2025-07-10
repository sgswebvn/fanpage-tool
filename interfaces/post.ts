// interfaces/post.ts
export interface Post {
    postId: string;
    pageId: string;
    message?: string;
    created_time: string;
    picture?: string;
    from?: { name: string };
    attachments?: { url: string }[];
}

export interface Fanpage {
    pageId: string;
    name: string;
    connected: boolean;
}