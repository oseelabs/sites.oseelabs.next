export type ApiResponse<T> = {
    data: T;
    message: string;
    error: {
        type: ErrorType;
        message: string;
        stack: unknown;
    } | null;
};

export enum ErrorType {
    DatabaseError,
    ServerError,
    MissingValueError,
    InvalidValueError,
    NotFoundError,
}