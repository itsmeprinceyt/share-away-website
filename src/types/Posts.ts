export default interface Post {
    id: number;
    posts_uuid: string;
    username: string;
    heart_count: number;
    user_id: number;
    posted_at: Date;
    content: JSON;
}