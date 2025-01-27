import type {NewUser, UserResponse} from "@/types/user";
import supabase from "@/lib/supabase";

export const getUserByEmail = async (email: string): Promise<UserResponse & { passHash: string }|null> => {
    const { data, error } = await supabase
        .from("genai-users")
        .select("*")
        .eq("email", email);

    if (error) throw error;
    if (data.length < 1) return null;
    const found = data[0];

    return {
        id: found.id,
        email: found.email,
        fullname: found.full_name,
        passHash: found.pass_hash,
    };
};

export const createUser = async (user: NewUser): Promise<UserResponse|null> => {
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

    const res = userData.map((user: UserResponse) => ({
        id: user.id,
        fullname: user.fullname,
        email: user.fullname
    }));

    return res[0] as UserResponse;
};