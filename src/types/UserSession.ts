export default interface UserSession {
    user: {
        uuid: string;
        id: number;
        pfp: string;
        username: string;
        email: string;
        isVerified: number;
        isAdmin: number;
        registeredDate: string;
    };
    expiry: string;
}
