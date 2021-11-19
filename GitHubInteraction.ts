import * as github from '@actions/github';
import { getInput } from '@actions/core';

export class GitHubInteraction {
  public static quineAccessTokenSecretName: string = 'QUINE_ACCESS_TOKEN';
  public static quineRefreshTokenSecretName: string = 'QUINE_REFRESH_TOKEN';
  private octokit;
  private readonly owner: string;
  private readonly repo: string;

  constructor() {
    const slug = process.env.GITHUB_REPOSITORY!
    const [owner, repo] = slug.split('/');
    if (!owner || !repo) {
      throw new Error('Cannot interact with GitHub. Missing owner and repo params.');
    }
    this.owner = owner;
    this.repo = repo;
    const token = getInput('token');
    console.log('GITHUB TOKEN LENGTH: ', token.length);
    this.octokit = github.getOctokit(token);
  }
  public async getQuineAccessToken(): Promise<string | null> {
    const res = await this.octokit.rest.actions.getRepoSecret({
      owner: this.owner,
      repo: this.repo,
      secret_name: GitHubInteraction.quineAccessTokenSecretName,
    });
    return res.data.name;
  }
  public async setQuineAccessToken(quineAccessToken: string): Promise<void> {
    await this.octokit.rest.actions.createOrUpdateRepoSecret({
      owner: this.owner,
      repo: this.repo,
      secret_name: "QUINE_ACCESS_TOKEN",
      encrypted_value: quineAccessToken
    });
  }
  public async getQuineRefreshToken(): Promise<string | null> {
    const res = await this.octokit.rest.actions.getRepoSecret({
      owner: this.owner,
      repo: this.repo,
      secret_name: GitHubInteraction.quineRefreshTokenSecretName,
    });
    return res.data.name;
  }
  public async setQuineRefreshToken(quineRefreshToken: string): Promise<void> {
    await this.octokit.rest.actions.createOrUpdateRepoSecret({
      owner: this.owner,
      repo: this.repo,
      secret_name: GitHubInteraction.quineRefreshTokenSecretName,
      encrypted_value: quineRefreshToken
    });
  }
}