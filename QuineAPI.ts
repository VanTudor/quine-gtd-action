const fetch = require('node-fetch');
export class QuineAPI {
  constructor(private bearerToken: string) {}

  public async getOnboardingInfo(userId: string) {
    const url = 'https://cosmos.quine.sh/api/whoami/user/onboarding-info/';
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({
        "user_id": 269
      }),
    });
    const res = await response.json();
    console.log(res);
  }

  public async getRepoRecommendations(): Promise<any> {
    const url = 'https://quine.sh/recommendations';
    const res = await fetch(url, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  private getHeaders(needsAuth: boolean) {
    const headers: {
      'Content-Type': string;
      Authorization?: string;
    } = { 'Content-Type': 'application/json' };
    if (needsAuth) {
      headers.Authorization = `Bearer ${this.bearerToken}`
    }
    return headers;
  }
}