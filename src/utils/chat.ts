import gemini from "@/lib/gemini";

export const chat = async (message: string, chatHistory: []) => {
    const chat = gemini.startChat({ history: chatHistory });

    return await chat.sendMessage(message);
};