import { NextResponse } from 'next/server'
import { hashedPass } from "@/utils/encryption";
import {createUser, getUserByEmail} from "@/utils/user";
import type { User } from "@/types/user";

export const POST = async (request: Request) => {
    const { email, password, fullname } = await request.json();

    if (!email || !password) {
        return new NextResponse(JSON.stringify({ error: 'Email and password are required' }), {
            status: 400,
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return new NextResponse(JSON.stringify({error: 'User already exists'}), {
                status: 409,
                headers: {
                    'content-type': 'application/json'
                }
            });
        }

        const passHash = await hashedPass(password);

        const newUser: User = {
            email: email,
            fullname: fullname ?? '',
            passHash: passHash,
        };

        // Save the new user to the database
        const createdUser = await createUser(newUser);

        if (!createdUser) {
            return new NextResponse(JSON.stringify({error: 'Failed to create user'}), {
                status: 500,
                headers: {
                    'content-type': 'application/json'
                }
            });
        }

        return new NextResponse(JSON.stringify(createdUser), {
            status: 201,
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
        });
    }
};