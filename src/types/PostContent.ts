export default interface PostContent {
    id: number;
    post_uuid: string;
    uuid: string;
    username: string;
    heart_count: number;
    user_id: number;
    posted_at: string;
    content: { 
        heading: string;
        body: string;
    };
}
