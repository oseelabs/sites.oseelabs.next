import { EnhancedGenerateContentResponse } from "@google/generative-ai";

export const makeStream = <T extends EnhancedGenerateContentResponse>(generator: AsyncGenerator<T, void, unknown>) =>  {
    const encoder = new TextEncoder();

    return new ReadableStream<any>({
        async start(controller) {
            for await (const chunk of generator) {
                const chunkData = encoder.encode(JSON.stringify(chunk));
                controller.enqueue(chunkData);
            }
            controller.close();
        }
    })
};
