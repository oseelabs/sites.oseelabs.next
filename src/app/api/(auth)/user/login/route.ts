import {NextResponse} from "next/server";
import {getUserByEmail} from "@/utils/user";
import {comparePass} from "@/utils/encryption";
import type {UserResponse} from "@/types/user";
import {ApiResponse, ErrorType} from "@/types/response";

export const GET = async () => {
    const data = {
        Documentation: {
            AccessMethod: 'POST',
            ResponseData: {
                message: "string",
                data: "User | null",
                error: {
                    type: ErrorType,
                    message: "string",
                    stack: "unknown"
                }
            }
        }
    }
    return new NextResponse(JSON.stringify(data, null, 2), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

export const POST = async (request: Request) => {
    const body = await request.json();
    const { email, password } = body;

    try {
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

        const user: UserResponse & { passHash: string } | null = await getUserByEmail(email);

        if (!user) {
            const res: ApiResponse<null> = {
                message: "An error occurred.",
                data: null,
                error: {
                    type: ErrorType.NotFoundError,
                    stack: "User not found",
                    message: "User not found"
                }
            };

            return new NextResponse(JSON.stringify(res, null, 2), {
                status: 404,
                headers: {
                    'content-type': 'application/json'
                }
            });
        }
        const passMatch = await comparePass(password, user.passHash);

        if (!user || !passMatch) {
            const res: ApiResponse<null> = {
                message: "An error occurred.",
                data: null,
                error: {
                    type: ErrorType.InvalidValueError,
                    stack: "Invalid email or password",
                    message: "Invalid email or password"
                }
            };
            return new NextResponse(JSON.stringify(res, null, 2), {
                status: 401,
                headers: {
                    'content-type': 'application/json'
                }
            });
        }

        const res: ApiResponse<UserResponse> = {
            message: "User found successfully.",
            data: {
                email: user.email,
                fullname: user.fullname,
                id: user.id,
            },
            error: null
        };

        return new NextResponse(JSON.stringify(res, null, 2), {
            status: 200,
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
                message: String(e)
            }
        };
        return new NextResponse(JSON.stringify(res, null, 2), {
            status: 500,
            headers: {
                'content-type': 'application/json'
            }
        })
    }
};

