import type UserProfile from './User';

export type SearchUser = Omit<UserProfile, 'isAdmin' | 'isVerified' | 'email' | 'posts'>;
