import {Auth0Auth, TAccessToken} from "./Auth0Auth";
import {GitHubInteraction} from "./GitHubInteraction";
import {decodeJWT, pollUntil} from "./utils";

export class Authentication {
  private auth0Auth: Auth0Auth;
  private gitHubInteraction: GitHubInteraction;

  constructor() {
    this.auth0Auth = new Auth0Auth();
    this.gitHubInteraction = new GitHubInteraction();
  }

  public async getQuineToken() {
    console.log('Getting access token secret or checking whether it\'s missing exists.')
    let storedToken = await this.gitHubInteraction.getQuineAccessToken();
    const now = Date.now();
    if (storedToken) {
      const decodedToken = decodeJWT(storedToken);
      const expiredToken = now - decodedToken.exp < 0;
      if (expiredToken) {
        const refreshToken = await this.gitHubInteraction.getQuineRefreshToken();
        if (refreshToken) {
          return await this.handleExpiredTokenFlow(refreshToken);
        } // missing refresh token. Shouldn't end up here unless the user manually deleted the refresh token stored in GitHub
        return await this.handleDeviceActivationFlow();
      }
      return storedToken;
    }
    // missing storedToken. This is either a fresh install or the user manually deleted the tokens
    return await this.handleDeviceActivationFlow();
  }

  private async handleExpiredTokenFlow(refreshToken: string): Promise<TAccessToken> {
    console.log('Running handleExpiredTokenFlow');
    const newAccessTokenResponse = await this.auth0Auth.exchangeRefreshTokenForAccessToken(refreshToken);
    console.log('fetched new access token');
    await this.gitHubInteraction.setQuineAccessToken(newAccessTokenResponse.accessToken);
    console.log('set new access token secret');
    await this.gitHubInteraction.setQuineRefreshToken(newAccessTokenResponse.refreshToken);
    console.log('set new refresh token secret');
    return newAccessTokenResponse.accessToken;
  }
  private async handleDeviceActivationFlow(): Promise<TAccessToken> {
    console.log('Running handleDeviceActivationFlow');
    const {
      deviceCode,
      userCode,
      verificationURI,
      expiresIn,
      interval,
      verificationUriComplete,
    } = await this.auth0Auth.requestDeviceCode();
    this.auth0Auth.requestDeviceActivation(verificationURI, userCode, verificationUriComplete);
    const newAccessTokenResponse = await this.auth0Auth.pollForTokens(deviceCode, expiresIn, interval);
    console.log('fetched new access token');
    if (!newAccessTokenResponse) {
      throw new Error('Device authorization code expired. Please run the action again.');
    }
    await this.gitHubInteraction.setQuineAccessToken(newAccessTokenResponse.accessToken);
    console.log('set new access token secret');
    await this.gitHubInteraction.setQuineRefreshToken(newAccessTokenResponse.refreshToken);
    console.log('set new refresh token secret');
    return newAccessTokenResponse.accessToken;
  }
}