export interface Post {
    postId: string;
    pageId: string;
    message: string;
    created_time: string;
    picture: string | null;
    likes: number;
    shares: number;
}