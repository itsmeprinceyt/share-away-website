export default interface User {
    uuid: string;
    id: number;
    pfp: string;
    username: string;
    email: string;
    isVerified: number;
    isAdmin: number;
    registeredDate: string;
}