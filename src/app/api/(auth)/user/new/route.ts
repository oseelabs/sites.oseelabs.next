import { NextResponse } from 'next/server'
import { hashedPass } from "@/utils/encryption";
import {createUser, getUserByEmail} from "@/utils/user";
import type { User } from "@/types/user";
import {ApiResponse, ErrorType} from "@/types/response";

export const POST = async (request: Request) => {
    const { email, password, fullname } = await request.json();

    if (!email || !password) {
            const res: ApiResponse<null> = {
                message: "An error occurred.",
                data: null,
                error: {
                    type: ErrorType.MissingValueError,
                    stack: "Email and password are required",
                    message: "Email and password are required"
                }
            };
            return new NextResponse(JSON.stringify(res, null, 2), {
            status: 400,
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            const res: ApiResponse<null> = {
                message: "An error occurred.",
                data: null,
                error: {
                    type: ErrorType.DatabaseError,
                    stack: "User already exists",
                    message: "User already exists"
                }
            };
            return new NextResponse(JSON.stringify(res, null, 2), {
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
            const res: ApiResponse<null> = {
                message: "An error occurred.",
                data: null,
                error: {
                    type: ErrorType.DatabaseError,
                    stack: "Failed to create user",
                    message: "Failed to create user"
                }
            };
            return new NextResponse(JSON.stringify(res, null, 2), {
                status: 500,
                headers: {
                    'content-type': 'application/json'
                }
            });
        }

        const res: ApiResponse<User> = {
            message: "User created successfully",
            data: createdUser,
            error: null
        };
        return new NextResponse(JSON.stringify(res, null, 2), {
            status: 201,
            headers: {
                'content-type': 'application/json'
            }
        });
    } catch (e) {
        const res: ApiResponse<null> = {
            message: "An error occurred.",
            data: null,
            error: {
                type: ErrorType.DatabaseError,
                stack: e,
                message: JSON.stringify(e)
            }
        };
        return new NextResponse(JSON.stringify(res, null, 2), {
            status: 500,
            headers: {
                'content-type': 'application/json'
            }
        });
    }
};