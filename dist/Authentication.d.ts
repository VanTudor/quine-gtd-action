import { Auth0Auth } from "./Auth0Auth";
export declare class Authentication {
    auth0Auth: Auth0Auth;
    private gitHubInteraction;
    constructor();
    getQuineAccessToken(): Promise<string>;
    private handleExpiredTokenFlow;
    private handleDeviceActivationFlow;
}
