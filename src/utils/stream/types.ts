import { Content } from "@google/generative-ai";

export type Item = {
    key: string;
    value: string;
};

export type ChatRequestBody = {
    message: string;
    chatHistory: Content[];
};
