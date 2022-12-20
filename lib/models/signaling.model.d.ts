export declare class UserResponse {
    Id: number;
    Error: string;
    Data: Map<string, string>;
    constructor(id: number, error: string, data: any);
    toString(): string;
}
export declare class UserRequest {
    Id: number;
    Target: string;
    Headers: Map<string, string>;
    Data: Map<string, string>;
    constructor(id: number, target: string, headers: Map<string, string>, data: Map<string, string>);
    toString(): string;
}
