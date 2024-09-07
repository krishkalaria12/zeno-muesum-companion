interface ResponseData<T> {
    message: string;
    success: boolean;
    status: number;
    data?: T
}

export function createResponse<T>(message: string, status: number, success: boolean, data?: T): ResponseData<T> {
    return {
        message,
        success,
        status,
        data
    };
}

