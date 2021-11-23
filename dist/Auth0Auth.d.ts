interface IReqDeviceCodeResponse {
    deviceCode: string;
    userCode: string;
    verificationURI: string;
    expiresIn: number;
    interval: number;
    verificationUriComplete: string;
}
export declare type TAccessToken = string;
export declare type TRefreshToken = string;
interface IAuth0TokensResponse {
    accessToken: TAccessToken;
    refreshToken: TRefreshToken;
    expiresIn: string;
}
export declare class Auth0Auth {
    deviceCode?: string;
    quineRefreshToken?: string;
    quineAccessToken?: string;
    initiated: boolean;
    constructor();
    getInstance(): Promise<void>;
    handleAuth(): Promise<void>;
    requestDeviceCode(): Promise<IReqDeviceCodeResponse>;
    requestDeviceActivation(verificationURI: string, userCode: string, prePopulatedCodeURI: string): Promise<void>;
    requestTokens(deviceCode: string): Promise<IAuth0TokensResponse | null>;
    exchangeRefreshTokenForAccessToken(refreshToken: string): Promise<IAuth0TokensResponse>;
    pollForTokens(deviceCode: string, expiresIn: number, tokenPollingIntervalSeconds: number): Promise<IAuth0TokensResponse>;
}
export {};
