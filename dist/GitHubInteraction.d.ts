export declare class GitHubInteraction {
    static quineAccessTokenSecretName: string;
    static quineRefreshTokenSecretName: string;
    private octokit;
    private readonly owner;
    private readonly repo;
    private repoPublicKey?;
    private repoPublicKeyID?;
    initiated: boolean;
    constructor();
    getInstance(): Promise<this>;
    setQuineAccessToken(quineAccessToken: string): Promise<void>;
    setQuineRefreshToken(quineRefreshToken: string): Promise<void>;
}
