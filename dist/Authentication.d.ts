export declare class Authentication {
    private auth0Auth;
    private gitHubInteraction;
    constructor();
    getQuineToken(): Promise<string>;
    private handleExpiredTokenFlow;
    private handleDeviceActivationFlow;
}
