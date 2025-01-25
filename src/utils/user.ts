import type { User } from "@/types/user";
import supabase from "@/lib/supabase";

export const getUserByEmail = async (email: string): Promise<User|null> => {
    const { data, error } = await supabase
        .from("genai-users")
        .select("*")
        .eq("email", email);

    if (error) throw error;
    if (data.length < 1) return null;
    const found = data[0];

    const foundUser = {
        id: found.id,
        email: found.email,
        fullname: found.full_name,
        passHash: found.pass_hash,
    }

    return foundUser as User;
};

export const createUser = async (user: User): Promise<User|null> => {
    const { error } = await supabase
        .from("genai-users")
        .insert({
            full_name: user.fullname,
            email: user.email,
            pass_hash: user.passHash,
        });

    if (error) throw error;

    const { data: userData, error: err } = await supabase
        .from("genai-users")
        .select("*")
        .eq("email", user.email);


    if (err) throw err;
    if (userData.length < 1) return null;

    return userData as unknown as User;
};