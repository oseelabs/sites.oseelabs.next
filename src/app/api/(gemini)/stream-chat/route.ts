import { ErrorType } from "@/types/response";
import { chatStream } from "@/utils/chat";
import { makeStream, StreamingResponse, ChatRequestBody } from "@/utils/stream";
import { EnhancedGenerateContentResponse } from "@google/generative-ai";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
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

    const stream = makeStream(
        fetchItems({ message, chatHistory })
    );

    const response = new StreamingResponse( stream );

    return response;
};


/**
 * 
 * @param { ChatRequestBody } chatRequestBody - The chat request body containing the message and chat history.
 * @returns { AsyncGenerator<EnhancedGenerateContentResponse, void, unknown> } - An async generator that yields items from the chat stream.
 */
async function *fetchItems({ message, chatHistory }: ChatRequestBody): AsyncGenerator<EnhancedGenerateContentResponse, void, unknown> {
    const result = await chatStream({ message, chatHistory });

    for await (const item of result.stream) {
        yield item;
    }
};
