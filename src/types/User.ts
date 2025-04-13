// User Type without password
export default interface User {
    id: number;
    uuid: string;
    pfp: string;
    username: string;
    email: string;
    isVerified: number;
    isAdmin: number;
    registeredDate: string;
}