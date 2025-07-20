export interface Fanpage {
    pageId: string;
    name: string;
    connected: boolean;
    access_token: string;
    expires_in?: number;
    picture?: string;

}