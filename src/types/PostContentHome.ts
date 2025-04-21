export type DeleteMode = "ASK" | "CONFIRM";

export default interface PostContentHome {
    post_uuid: string;
    user_uuid: string;
    username: string;
    pfp: string;
    content: { heading: string; body: string };
    heart_count: number;
    posted_at: string;
    isAdmin: number | string | null | boolean;
    isOwner: number | string | null | boolean;
    hasHearted: boolean;
    onToggleHeart: (post_uuid: string, hasHearted: boolean) => void;
    onDelete: (post_uuid: string, type: DeleteMode) => Promise<void>;
}