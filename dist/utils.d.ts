interface IAuth0DecodedJWT {
    iss: string;
    sub: string;
    aud: string[];
    iat: string;
    exp: number;
    scope: string;
}
export declare function decodeJWT(jwt: string): IAuth0DecodedJWT;
export declare function pollUntil<T>(expiresIn: number, intervalMillis: number, method: () => Promise<T>, checkShouldStopPolling: (p: T) => boolean): Promise<T>;
export {};
