export type User = {
    id?: string;
    fullname: string;
    email: string;
    passHash: string;
};

export type UserResponse = {
    id: string;
    fullname: string;
    email: string;
};