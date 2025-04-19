export type DeleteMode = "ASK" | "CONFIRM";

export default interface PostCardProps {
    id: number;
    post_uuid: string;
    uuid: string;
    username: string;
    heading: string;
    body: string;
    heart_count: number;
    hasHearted: boolean;
    posted_at: string;
    isAdmin: boolean;
    isOwner: boolean;
    onToggleHeart: (post_uuid: string, hasHearted: boolean) => void;
    onDelete: (post_uuid: string, type: DeleteMode) => Promise<void>; // <- MATCH this
}