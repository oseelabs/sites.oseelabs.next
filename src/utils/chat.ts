import gemini from "@/lib/gemini";
import {Content} from "@google/generative-ai";

type ChatProps = { message: string, chatHistory: Content[] };

export const chat = async ({ message, chatHistory }: ChatProps) => {
    const chat = gemini.startChat({ history: chatHistory });

    return await chat.sendMessage(message);
};

export const chatStream = async ({ message, chatHistory }: ChatProps) => {
    const chat = gemini.startChat({ history: chatHistory });

    return await chat.sendMessageStream(message);
};
