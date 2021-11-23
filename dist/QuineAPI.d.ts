export declare class QuineAPI {
    private bearerToken;
    constructor(bearerToken: string);
    getOnboardingInfo(userId: string): Promise<void>;
    getRepoRecommendations(): Promise<any>;
    private getHeaders;
}
