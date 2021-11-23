export declare class Authentication {
    private auth0Auth;
    private gitHubInteraction;
    constructor();
    getQuineAccessToken(): Promise<string>;
    private handleExpiredTokenFlow;
    private handleDeviceActivationFlow;
}
