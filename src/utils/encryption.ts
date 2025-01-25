import { compare, hash } from 'bcrypt';

export const comparePass = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await compare(password, hashedPassword);
};

export const hashedPass = async (password: string): Promise<string> => {
    return await hash(password, 10);
};