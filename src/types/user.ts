
export type NewUser = {
    passHash: string;
    fullname: string;
    email: string;
}

export type UserResponse = {
    id: string;
    fullname: string;
    email: string;
};