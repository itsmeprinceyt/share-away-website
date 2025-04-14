import Post from './PostContent';

export default interface UserProfile {
    id: number;
    uuid: string;
    username: string;
    email: string;
    isAdmin: number;
    isVerified: number;
    pfp: string;
    registeredDate: string;
    totalPosts: number;
    totalHearts: number;
    posts: Post[];
}