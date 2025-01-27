import {
    GenerationConfig,
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
    SafetySetting
} from "@google/generative-ai";

const API_KEY: string = String(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const genAi = new GoogleGenerativeAI(API_KEY);
const gemini = genAi.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: 'You always reply in markdown string',
    generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.7,
        responseMimeType: 'text/plain',
    } as GenerationConfig,
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
    ] as SafetySetting[],

}, {});

export default gemini;