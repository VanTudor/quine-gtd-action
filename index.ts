import { Authentication } from "./Authentication";
import { QuineAPI } from "./QuineAPI";
import { getInput } from '@actions/core';
const cronParser = require('cron-parser');


async function action(publishIn?: string){
  const auth = new Authentication();
  const quineAccessToken = await auth.getQuineAccessToken();

  const auth0UserInfo = await auth.auth0Auth.getUserInfo(quineAccessToken);

  console.log('Received Auth0 user info.');
  const quineAPI = new QuineAPI(quineAccessToken, auth0UserInfo);
  const quineUserId = await quineAPI.getQuineUserId();
  console.log('Received Quine userId');
  const repoRecommendations = await quineAPI.getRepoRecommendations(Number(quineUserId), [{group: "all"}]);
  console.log('Received repo recommendations.');
  const repoDetails = await quineAPI.getReposInfo(Number(quineUserId), repoRecommendations.map(repo => repo.repo_id));
  console.log('Received repos info.');
  console.log(JSON.stringify(repoDetails));
  console.log("PUBLISH IN VALUE: ", publishIn);
  switch(publishIn) {
    case "porter-issue":
      await auth.gitHubInteraction.updateTicket(repoDetails);
      break;
    case "separate-issue":
      await auth.gitHubInteraction.createTicket(repoDetails);
      break;
    default:
      await auth.gitHubInteraction.updateTicket(repoDetails);
  }
  console.log('Posted to GitHub issue.');
}

function getComparableDateParams(dateObj: Date): { day: number, month: number, year: number } {
  return {
    day: dateObj.getDay(),
    month: dateObj.getMonth(),
    year: dateObj.getFullYear()
  }
}

function compareDates(date1: Date, date2: Date) {
  const d1Params = getComparableDateParams(date1);
  const d2Params = getComparableDateParams(date2);
  return d1Params.day === d2Params.day && d1Params.month === d2Params.month && d1Params.year === d2Params.year;
}

async function main () {
  const runCron = getInput('run-cron');
  const publishIn = getInput('publish-in');
  if (runCron) {
    const parseRes = cronParser.parseExpression(runCron).prev();
    const currentTime = new Date();
    if (compareDates(parseRes, currentTime)) {
      await action(publishIn);
      return;
    }
      console.log(`Current date ${Date.now()} doesn't match input cron "${runCron}". Skipping execution...`);
      return;
  }
  await action(publishIn);
}

main();


