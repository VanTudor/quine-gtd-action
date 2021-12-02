import {Auth0Auth} from "./Auth0Auth";
import {QuineAPI} from "./QuineAPI";

async function main() {
  // const auth0Auth = new Auth0Auth();
  // const {
  //   deviceCode,
  //   userCode,
  //   verificationURI,
  //   expiresIn,
  //   interval,
  //   verificationUriComplete,
  // } = await auth0Auth.requestDeviceCode();
  // await auth0Auth.requestDeviceActivation(verificationURI, userCode, verificationUriComplete);
  // const newAccessTokenResponse = await auth0Auth.pollForTokens(deviceCode, verificationUriComplete, expiresIn, interval);
  // console.log(JSON.stringify(newAccessTokenResponse));
  const quineAccessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkN1a3J1SUQzeXJRN0xwb2lUV0trYyJ9.eyJpc3MiOiJodHRwczovL3F1aW5lLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnaXRodWJ8NzU1NjY4OSIsImF1ZCI6WyJodHRwczovL3F1aW5lLmV1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9xdWluZS5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjM4NDMxNTc5LCJleHAiOjE2NDEwMjM1NzksImF6cCI6IldoSVRhdXdpaDUzd2kzODJsUDB3eGg5ZjdSUFFRS0dSIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2VzcyJ9.g2FAqvULsPnrAYKa0MQTqdhR4F52ez5yzXAX-Eo7LtjjiL2RPU7RXAy6FgTs8io-i0WwezI8j0GJjB9AuwMhUveta693PxcU44Fyv6E3UFRmLUVljZChTEK6zKUd_SGcq7quqUmVidwV2mGeLJJ81f-vF5D5amJRmFwo7e8qX_WZ84qaUjMI9-xroNYFaTv0b5Kx5lrxSYeNp7Yw_y0Dj00U-FJ1hl7UMqras26XoArSUA2r5MJxUB-DgdXVTQGM5P6umKT2eopSxSTCQFQ6BFFVm15QpP3NzjdNzSs23XWECB6zX0KAAMffOxEJFvGSTHrmbm1q3rewi-I6wVTDBQ";
  const auth0Auth = new Auth0Auth();
  const auth0UserInfo = await auth0Auth.getUserInfo(quineAccessToken);

  console.log('Received Auth0 user info.');
  console.log(JSON.stringify(auth0UserInfo));
  const quineAPI = new QuineAPI(quineAccessToken, auth0UserInfo);
  const quineUserId = await quineAPI.getQuineUserId();
  const k = quineUserId;
  console.log(quineUserId);
  console.log(k);

}
main();