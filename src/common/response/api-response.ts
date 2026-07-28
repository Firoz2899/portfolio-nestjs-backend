// export class ApiResponse<T = unknown> {
//   constructor(
//     public readonly Data: T | null = null,
//     public readonly Message: string = 'Operation Successful',
//     public readonly IsSuccess: boolean,
//     public readonly ErrorType: string | null = null,
//     public readonly Errors: unknown[] | null = null,
//   ) {}
// }

export class ApiResponse<T = unknown> {

    static success<T>(
        data: T,
        message = 'Operation Successful',
    ) {
        return {
            IsSuccess: true,
            Message: message,
            Data: data,
            ErrorType: null,
            Errors: null,
        };
    }

    static failure(
        message: string,
        errorType: string,
        errors?: unknown[] | null,
    ) {
        return {
            IsSuccess: false,
            Message: message,
            Data: null,
            ErrorType: errorType,
            Errors: errors ?? null,
        };
    }

}