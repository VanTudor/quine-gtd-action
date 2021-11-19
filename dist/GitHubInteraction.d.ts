export declare class GitHubInteraction {
    static quineAccessTokenSecretName: string;
    static quineRefreshTokenSecretName: string;
    private octokit;
    private readonly owner;
    private readonly repo;
    constructor();
    getQuineAccessToken(): Promise<string | null>;
    setQuineAccessToken(quineAccessToken: string): Promise<void>;
    getQuineRefreshToken(): Promise<string | null>;
    setQuineRefreshToken(quineRefreshToken: string): Promise<void>;
}
