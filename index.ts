import { Authentication } from "./Authentication";
import {QuineAPI} from "./QuineAPI";

import * as github from '@actions/github';
import { getInput } from '@actions/core';
import {decodeJWT} from "./utils";
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


async function main () {
  const auth = new Authentication();
  const quineAccessToken = await auth.getQuineAccessToken();
  // dev
  const k = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRsc2FzZTd4cVJ4Y2pITm5ydUtudSJ9.eyJpc3MiOiJodHRwczovL2Rldi02ZWZ2bW02Ny5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjE5NjEzNDY4ZDRmNDAwMDY5YTZmY2Q2IiwiYXVkIjpbImh0dHBzOi8vZGV2LTZlZnZtbTY3LmV1LmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9kZXYtNmVmdm1tNjcuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYzNzY1NDgxMSwiZXhwIjoxNjQwMjQ2ODExLCJhenAiOiJRTldVUVF2Rm9XOEY1aFFiZXJmN2pieG5PR0JDY2kwTyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MifQ.sgJ1TXfj9U7buh-ghnSvYQgDWHIZa93wJClqlx9tau9wB98fAobNm0Hq58Vbix6RAqlE5KhOWaoCiwn0b5GEeF4C-N4_PS9TrJSr91Uj1gV_6vaTUBlGd5CEHBudFhu3rPO34NpvxRz5gqVZmA1dkru4cy-kdbCNuUeQgB0GabfeVOEFFd2VoZRf_64h31ZHo9uf82_bg7ugpUtZp3eCBwYyMtrKS28WRMpZRUnEZBoLzxxIBNSEncZAhKUV3b1asNUILV8IuQ-X8JhhNILHo7aP5mcwMUilORAVCwtLA9fBs3_VpgcGAqt65J3Z2prbuC6AUL-8RONWkXkLihrpUg';
  // prod
  const quineAPI = new QuineAPI(quineAccessToken);
  const data0 = await quineAPI.getOnboardingInfo();
  // const data1 = await quineAPI.getRepoRecommendations();
}

main();