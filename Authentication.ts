import { Auth0Auth, TAccessToken } from "./Auth0Auth";
import { GitHubInteraction } from "./GitHubInteraction";
import { decodeJWT, pollUntil } from "./utils";

export class Authentication {
  private auth0Auth: Auth0Auth;
  private gitHubInteraction: GitHubInteraction;

  constructor() {
    this.auth0Auth = new Auth0Auth();
    this.gitHubInteraction = new GitHubInteraction();
  }

  public async getQuineAccessToken() {
    if (!this.gitHubInteraction.initiated) {
      this.gitHubInteraction = await this.gitHubInteraction.getInstance();
    }
    console.log('Getting access token secret or checking whether it\'s missing.');
    let storedAccessToken = this.auth0Auth.quineAccessToken || null;
    const storedrRefreshToken = this.auth0Auth.quineRefreshToken || null;

    console.log('Finished getting access token secret or checking whether it\'s missing.');

    const now = Date.now();
    if (storedAccessToken && storedAccessToken.length > 1) {
      const decodedToken = decodeJWT(storedAccessToken);
      const expiredAccessToken = now - decodedToken.exp < 0;
      if (expiredAccessToken) {
        if (storedrRefreshToken && storedrRefreshToken.length > 1) {
          const refreshToken = await this.handleExpiredTokenFlow(storedrRefreshToken);
          this.auth0Auth.quineRefreshToken = refreshToken;
          return refreshToken;
        } // missing refresh token. Shouldn't end up here unless the user manually deleted the refresh token stored in GitHub
        const accessToken = await this.handleDeviceActivationFlow();
        // TODO: maybe store this as a global so, you don't go through the auth flow every time
        // instantiate the Auth0Auth class, if the token's missing from the env vars
        this.auth0Auth.quineAccessToken = accessToken;
        return accessToken;
      }
      return storedAccessToken;
    }
    // missing storedToken. This is either a fresh install or the user manually deleted the tokens
    const accessToken = await this.handleDeviceActivationFlow();
    // TODO: maybe store this as a global so, you don't go through the auth flow every time
    // instantiate the Auth0Auth class, if the token's missing from the env vars
    this.auth0Auth.quineAccessToken = accessToken;
    return accessToken;
  }

  private async handleExpiredTokenFlow(refreshToken: string): Promise<TAccessToken> {
    const ghInteractionInstance = await this.gitHubInteraction.getInstance();
    console.log('Running handleExpiredTokenFlow');
    const newAccessTokenResponse = await this.auth0Auth.exchangeRefreshTokenForAccessToken(refreshToken);
    console.log('fetched new access token');
    await ghInteractionInstance.setQuineAccessToken(newAccessTokenResponse.accessToken);
    console.log('set new access token secret');
    await ghInteractionInstance.setQuineRefreshToken(newAccessTokenResponse.refreshToken);
    console.log('set new refresh token secret');
    return newAccessTokenResponse.accessToken;
  }
  private async handleDeviceActivationFlow(): Promise<TAccessToken> {
    const ghInteractionInstance = await this.gitHubInteraction.getInstance();
    console.log('Running handleDeviceActivationFlow');
    const {
      deviceCode,
      userCode,
      verificationURI,
      expiresIn,
      interval,
      verificationUriComplete,
    } = await this.auth0Auth.requestDeviceCode();
    // this.tokenPollingInterval = interval;
    await this.auth0Auth.requestDeviceActivation(verificationURI, userCode, verificationUriComplete);
    const newAccessTokenResponse = await this.auth0Auth.pollForTokens(deviceCode, expiresIn, interval);
    console.log('fetched new access token');
    if (!newAccessTokenResponse) {
      throw new Error('Device authorization code expired. Please run the action again.');
    }
    await ghInteractionInstance.setQuineAccessToken(newAccessTokenResponse.accessToken);
    console.log('set new access token secret');
    await ghInteractionInstance.setQuineRefreshToken(newAccessTokenResponse.refreshToken);
    console.log('set new refresh token secret');
    return newAccessTokenResponse.accessToken;
  }
}