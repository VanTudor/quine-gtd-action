import * as github from '@actions/github';
import {encryptGHSecret} from "./utils";

export class GitHubInteraction {
  public static quineAccessTokenSecretName: string = 'QUINE_ACCESS_TOKEN';
  public static quineRefreshTokenSecretName: string = 'QUINE_REFRESH_TOKEN';
  private octokit;
  private readonly owner: string;
  private readonly repo: string;
  private repoPublicKey?: string;
  private repoPublicKeyID?: string;
  public initiated: boolean;

  constructor() {
    this.initiated = false;
    const slug = process.env.GITHUB_REPOSITORY || "VanTudor/gtd";
    const [owner, repo] = slug.split('/');
    if (!owner || !repo) {
      throw new Error('Cannot interact with GitHub. Missing owner and repo params.');
    }
    this.owner = owner;
    this.repo = repo;
    const PAT = getInput('gh-pat');
    if (!PAT) {
      throw new Error("Missing Personal Access Token. Make sure you that:\n" +
        "- you have a QUINE_GH_PAT secret added to your gtd repo's secrets page. It should contain your PAT with repo: all and org: read scopes.\n" +
        "- you have edited your gtd porter.yml file to supply the secret as an input to this action/job. See README.md for more details.");
    }
    this.octokit = github.getOctokit(PAT);
  }
  public async getInstance(): Promise<this> {
    if (this.initiated) {
      return this;
    }
    const pk = await this.octokit.rest.actions.getRepoPublicKey({
      owner: this.owner,
      repo: this.repo,
    });
    this.repoPublicKey = pk.data.key;
    this.repoPublicKeyID = pk.data.key_id;
    this.initiated = true;
    return this;
  }
  public async setQuineAccessToken(quineAccessToken: string): Promise<void> {
    if (this.repoPublicKey && this.repoPublicKeyID) {
      await this.octokit.rest.actions.createOrUpdateRepoSecret({
        owner: this.owner,
        repo: this.repo,
        key_id: this.repoPublicKeyID,
        secret_name: "QUINE_ACCESS_TOKEN",
        encrypted_value: encryptGHSecret(this.repoPublicKey, quineAccessToken),
      });
      return;
    }
    throw new Error('No repo public key id could be found. Possible misuse of this method. Did you forget to run GitHubInteraction.init()?')
  }
  public async setQuineRefreshToken(quineRefreshToken: string): Promise<void> {
    if (this.repoPublicKey && this.repoPublicKeyID) {
      await this.octokit.rest.actions.createOrUpdateRepoSecret({
        owner: this.owner,
        repo: this.repo,
        secret_name: GitHubInteraction.quineRefreshTokenSecretName,
        key_id: this.repoPublicKeyID,
        encrypted_value: encryptGHSecret(this.repoPublicKey, quineRefreshToken),
      });
      return;
    }
    throw new Error('No repo public key id could be found. Possible misuse of this method. Did you forget to run GitHubInteraction.init()?')
  }

  // public async postComment(commentText: string) {
  //   const new_comment = await octokit.rest.issues.createComment({
  //     owner: this.owner,
  //     repo: this.repo,
  //     issue_number: today,
  //     body: comment.body ?? '',
  //   });
  // }
}