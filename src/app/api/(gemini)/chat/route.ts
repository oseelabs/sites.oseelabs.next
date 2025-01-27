import {NextResponse} from "next/server";
import {ApiResponse, ErrorType} from "@/types/response";
import {chat} from "@/utils/chat";

export const GET = async (request: Request) => {
    const res: ApiResponse<string> = {
        message: 'Use `POST` method to chat with the AI',
        data: `Hello, DON'T use \`${request.method}\` Method please`,
        error: null,
    }
    return new NextResponse(JSON.stringify(res, null, 2), {
        status: 200,
    });
};

export const POST = async (request: Request) => {
    const body = request.json()
    const { message, chatHistory } = await body;

    if (!message) {
        const res = {
            message: 'Message is required',
            data: null,
            error: {
                type: ErrorType.MissingField,
                message: 'Message field is required'
            },
        }
        return new NextResponse(JSON.stringify(res, null, 2), {
            status: 201
        })
    }

    const result = await chat(message, chatHistory ?? [])

    const res = {
        message: 'Message sent successfully',
        data: result,
        error: null,
    }

    console.warn(result)

    return new NextResponse(JSON.stringify(res, null, 2), {
        status: 201
    })
};