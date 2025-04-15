/**
 * A custom Response subclass that accepts a ReadableStream.
 * This allows creating a streaming Resonse for async generators.
 */
export class StreamingResponse extends Response {
    // @typescript-eslint/explicit-any
    constructor( res: ReadableStream<any>, init?: ResponseInit ) {
        super(res, {
            ...init,
            status: 200,
            headers: {
                ...init?.headers,
            }
        })
    }
};
