const fetch = require('node-fetch');
export class QuineAPI {
  constructor(private bearerToken: string) {}

  public async getOnboardingInfo() {
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
    return res;
  }

  public async getRepoRecommendations(): Promise<any> {
    const url = 'https://cosmos.quine.sh/api/scout/recommendation/';
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({
        "user_id":269,
        "refresh":true,
        "recommendation_groups":[
          {"group":"all"},{"group":"c"},{"group":"c++"},{"group":"javascript"},{"group":"typescript"}]})
    });
    const k = await res.json();
    console.log(JSON.stringify(k));
    return k;
  }

  private getHeaders(needsAuth: boolean) {
    const headers: {
      'Content-Type': string;
      Authorization?: string;
      Accept: string;
    } = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (needsAuth) {
      headers.Authorization = `Bearer ${this.bearerToken}`
    }
    return headers;
  }
}