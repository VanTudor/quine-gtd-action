export declare class QuineAPI {
    private bearerToken;
    constructor(bearerToken: string);
    getOnboardingInfo(): Promise<any>;
    getRepoRecommendations(): Promise<any>;
    private getHeaders;
}
