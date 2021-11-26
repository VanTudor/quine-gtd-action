import { Authentication } from "./Authentication";
import { QuineAPI } from "./QuineAPI";

import * as github from '@actions/github';
import { getInput } from '@actions/core';
import { decodeJWT } from "./utils";
import dayjs from "dayjs";
import date from "../quine-front/src/utils/date";
const fetch = require('node-fetch');
const runCron = getInput('run-cron');
const cronParser = require('cron-parser');
//
// const slug = process.env.GITHUB_REPOSITORY!
// const [owner, repo] = slug.split('/')
// const issue_number = parseInt((getInput('yesterday') || process.env.GTD_YESTERDAY)!)
// const today = parseInt((getInput('today') || process.env.GTD_TODAY)!)
// const token = getInput('token')!
// const octokit = github.getOctokit(token)
//
// const comments = await octokit.rest.issues.listComments({ owner, repo, issue_number })
//
// for (const comment of comments.data) {
//   const reactions = await octokit.rest.reactions.listForIssueComment({
//     owner, repo, comment_id: comment.id
//   })
//
//   if (!reactions.data.map(rxn => rxn.content).includes('eyes')) continue;
//
//   const new_comment = await octokit.rest.issues.createComment({
//     owner, repo, issue_number: today, body: comment.body ?? ''
//   })
//
//   await octokit.rest.reactions.createForIssueComment({
//     owner, repo, comment_id: new_comment.data.id, content: 'eyes'
//   })
// }

async function action(){
  const auth = new Authentication();
  const quineAccessToken = await auth.getQuineAccessToken();

  const auth0UserInfo = await auth.auth0Auth.getUserInfo(quineAccessToken);

  console.log('Received Auth0 user info.');
  const quineAPI = new QuineAPI(quineAccessToken, auth0UserInfo);
  const quineUserId = await quineAPI.getQuineUserId();
  console.log('Received Quine userId');
  const data1 = await quineAPI.getRepoRecommendations(Number(quineUserId), [{group: "all"}]);
  console.log('Received repo recommendations.');
  const data2 = await quineAPI.getReposInfo(Number(quineUserId), data1.map(repo => repo.repo_id));
  console.log('Received repos info.');
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
  if (runCron) {
    const parseRes = cronParser.parseExpression(runCron).prev();
    const currentTime = new Date();
    if (compareDates(parseRes, currentTime)) {
      await action();
      return;
    }
      console.log(`Current date ${Date.now()} doesn't match input cron "${runCron}". Skipping execution...`);
      return;
  }
  await action();
}

main();


