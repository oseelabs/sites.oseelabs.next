import {NextResponse} from "next/server";
import {getUserByEmail} from "@/utils/user";
import {comparePass} from "@/utils/encryption";
import type {User} from "@/types/user";

export const POST = async (request: Request) => {
    const body = await request.json();
    const { email, password } = body;

    try {
        if (!email || !password) {
            return new NextResponse(JSON.stringify({error: 'Email and password are required'}), {
                status: 400,
                headers: {
                    'content-type': 'application/json'
                }
            });
        }

        const user: User|null = await getUserByEmail(email);
        if (!user) {
            return new NextResponse(JSON.stringify({error: 'User not found'}), {
                status: 404,
                headers: {
                    'content-type': 'application/json'
                }
            });
        }
        const passMatch = await comparePass(password, user.passHash);
        console.log("\t\t\t\t\tPass Match?: ", passMatch ? 'Yes':'No');

        if (!user || !passMatch) {
            return new NextResponse(JSON.stringify({error: 'Invalid email or password'}), {
                status: 401,
                headers: {
                    'content-type': 'application/json'
                }
            });
        }

        return new NextResponse(JSON.stringify(user), {
            status: 200,
            headers: {
                'content-type': 'application/json'
            }
        });
    } catch (e) {
        return new NextResponse(JSON.stringify({error: e}), {
            status: 500,
            headers: {
                'content-type': 'application/json'
            }
        })
    }
};

