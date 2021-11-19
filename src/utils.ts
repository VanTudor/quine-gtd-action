const sodium = require('tweetsodium');

interface IAuth0DecodedJWT {
  iss: string; // domain
  sub: string; // format: `${connectionName}|${someId}`. Example: "github|134743" or "auth0|619613468d4f400069a6fcd6"
  aud: string[]; // Array of accessible audiences. Example: ["https://dev-6efvmm67.eu.auth0.com/api/v2/","https://dev-6efvmm67.eu.auth0.com/userinfo"]
  iat: string; // createdAt timestamp
  exp: number; // expirestAt timestamp
  scope: string; // eg: "openid profile email. Corresponds to the scope requested when calling the generate device code auth route in Auth0
}

export function decodeJWT(jwt: string): IAuth0DecodedJWT {
  const tokenDecodablePart = jwt.split('.')[1];
  if (typeof tokenDecodablePart === 'undefined') {
    throw new Error('Error while decoding JWT. Invalid format. Possible OAuth authentication issue.');
  }
  const decoded = Buffer.from(tokenDecodablePart, 'base64').toString();
  console.log('Decoded JWT: ', decoded);
  const parsedJWT = JSON.parse(decoded);
  return {
    iss: parsedJWT.iss,
    sub: parsedJWT.sub,
    aud: parsedJWT.aud,
    iat: parsedJWT.iat,
    exp: Number(parsedJWT.exp),
    scope: parsedJWT.scope
  }
}


export async function pollUntil<T>(
  expiresIn: number,
  intervalMillis: number,
  method: () => Promise<T>,
  checkShouldStopPolling: (p: T) => boolean
) {
  const startTime = Date.now();
  let time1 = Date.now();
  let time2 = time1 + intervalMillis;
  let res = await method();
  let codeExpired = startTime + expiresIn > Date.now();
  while (codeExpired && !checkShouldStopPolling(res)) {
    // console.log('!!', time2-time1);
    if (time2 - time1 > intervalMillis) {
      // console.log(time2-time1, '>', intervalMillis);
      res = await method();
      time1 = time2;
    }
    time2 = Date.now();
    codeExpired = startTime + expiresIn < time2;
  }
  return res;
}

export function encryptToken(unencryptedToken: string): string {
  const key = "base64-encoded-public-key";

  const messageBytes = Buffer.from(unencryptedToken);
  const keyBytes = Buffer.from(key, 'base64');

  const encryptedBytes = sodium.seal(messageBytes, keyBytes);
  return Buffer.from(encryptedBytes).toString('base64');
}