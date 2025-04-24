export type SearchPost = {
    post_uuid: string;
    uuid: string;
    username: string;
    pfp: string | null;
    content: string;
    posted_at: string;
    heart_count: number;
};