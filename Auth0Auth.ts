// see https://auth0.com/docs/authorization/flows/call-your-api-using-the-device-authorization-flow#request-tokens
// for a step-by-step guide on the auth flow
/**
 * If first time run or Quine API token (QAt) expired:
 * 1. Get a QAt via Auth0 calls
 * 2. Store the QAt in GitHub Secrets
 * ELSE
 * 3. Fetch the QAt from GH Secrets
 * ENDIF
 * 4. Use QAt to call the Quine API
 */
import { config } from './config';
import {pollUntil} from "./utils";
const fetch = require('node-fetch');
// const auth0Hostname = 'https://quine.eu.auth0.com';
//
// const deviceActivationEndpoint = '/oauth/device/code';
// const deviceActivationURI = auth0Hostname + deviceActivationEndpoint;
//
// const tokenEndpoint = '/oauth/token';
// const tokenURI = auth0Hostname + tokenEndpoint;
//
// const auth0ClientId = 'WhITauwih53wi382lP0wxh9f7RPQQKGR';
// GITNFT ONE
// const auth0Domain = 'https://quine.sh/gitnft/api';
const auth0Domain = 'https://cosmos-dev.quine.sh/api';

const apiHostname = 'https://cosmos-dev.quine.sh/api';

interface IAuth0ReqDeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number; // polling interval to be used when veryfying if the user is logged in
  verification_uri_complete: string;
}
interface IReqDeviceCodeResponse {
  deviceCode: string;
  userCode: string;
  verificationURI: string;
  expiresIn: number;
  interval: number;
  verificationUriComplete: string;
}

export type TAccessToken = string;
export type TRefreshToken = string;

interface IAuth0RequestTokensResponse {
  access_token: TAccessToken;
  refresh_token?: TRefreshToken;
  expires_in?: number;
}

interface IAuth0TokensResponse {
  accessToken: TAccessToken;
  refreshToken: TRefreshToken;
  expiresIn: string;
}
export class Auth0Auth {
  public deviceCode?: string;
  public tokenPollingInterval?: number;
  constructor() {}

  public async handleAuth() {
    if (!this.deviceCode) {

    }
  }

  public async requestDeviceCode(): Promise<IReqDeviceCodeResponse> {
    const params = new URLSearchParams();
    params.append('client_id', config.auth0ClientId);
    params.append('audience', config.audience);
    params.append('scope', 'profile email openid');
    const response = await fetch(config.deviceActivationURI, { method: 'POST', body: params });
    const data = await response.json() as IAuth0ReqDeviceCodeResponse;
    console.log("requestDeviceCode response: ", JSON.stringify(data));
    return {
      deviceCode: data.device_code,
      userCode: data.user_code,
      verificationURI: data.verification_uri,
      expiresIn: data.expires_in,
      interval: data.interval,
      verificationUriComplete: data.verification_uri_complete,
    };
  }

   public async requestDeviceActivation(verificationURI: string, userCode: string, prePopulatedCodeURI: string) {
    console.log(`On your computer or mobile device, go to ${verificationURI} and type in the following code:`);
    console.log(`Or just follow the following link: ${prePopulatedCodeURI}`);
    console.log(userCode);
  }

  public async requestTokens(deviceCode: string): Promise<IAuth0TokensResponse | null> {
    console.log("Calling request tokens...");
    console.log('device_code', deviceCode);
    console.log('client_id', config.auth0ClientId);
    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:device_code');
    params.append('device_code', deviceCode);
    params.append('client_id', config.auth0ClientId);

    const response = await fetch(config.tokenURI, { method: 'POST', body: params });
    const res = await response.json();
    console.log("Request tokens response: ", res);
    if (res.access_token) {
      return {
        refreshToken: res.refresh_token,
        accessToken: res.access_token,
        expiresIn: res.expires_in,
      }
    }
    return null;
  }

  public async exchangeRefreshTokenForAccessToken(refreshToken: string): Promise<IAuth0TokensResponse> {
    return {
      refreshToken: 'test',// res.refresh_token,
      accessToken: 'test',// res.access_token,
      expiresIn: '10', // res.expires_in,
    };
  }

  public async pollForTokens(deviceCode: string, expiresIn: number, tokenPollingIntervalSeconds: number): Promise<IAuth0TokensResponse> {
    if (this.tokenPollingInterval) {
      const res = await pollUntil<IAuth0TokensResponse | null>(
        expiresIn,
        tokenPollingIntervalSeconds * 1000,
        () => this.requestTokens(deviceCode),
        (res) => res === null
      );
      console.log(res);
      if (res !== null) {
        return res;
      }
      throw new Error('An error occurred when asking for auth token. Token received is null. Did you authenticate this using code displayed earlier?');
    }
    throw new Error('An error occurred when asking for auth token. No polling interval set. Did you authenticate this using code displayed earlier?');
  }
}

async function main() {
  // const params = new URLSearchParams();
  // params.append('client_id', auth0ClientId);
  // params.append('scope', '');
  // params.append('audience', auth0Domain);
  // --header 'content-type: application/x-www-form-urlencoded' \
  // --data 'client_id=BqBM24jGs8139h4Pw9x3y9YZ6D7rDJb2' \
  // --data scope=SCOPE \
  // --data audience=AUDIENCE
  // const response = await fetch(deviceActivationURI, { method: 'POST', body: params });
  // const data = await response.json();
  // console.log(JSON.stringify(data));

  // const res = await requestDeviceCode();
  // requestDeviceActivation(res.verificationURI, res.userCode);

  // console.log('mock token: ', token);

}


main();
