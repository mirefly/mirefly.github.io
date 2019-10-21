#!/usr/bin/env node
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const URL_COMMITS = 'https://api.github.com/search/commits';
const OUTPUT_PATH = path.resolve(__dirname, '../data/commits.json');

function makeQuery(repo) {
  return `?q=repo:${repo}+author:mirefly`;
}

repos = [
  'mozilla/addons-code-manager',
  'mozilla/addons-frontend',
  'mozilla/fxa',
  'mozilla/application-services',
];

async function fetchCommits(query) {
  const resp = await fetch(URL_COMMITS + query, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.cloak-preview',
    },
  });

  if (!resp.ok) {
    throw Error('The Response is not OK');
  }

  let data = await resp.json();

  data = data.items.map(v => {
    return {
      sha: v.sha,
      htmlUrl: v.html_url,
      date: v.commit.author.date,
      message: v.commit.message,
    };
  });

  return data;
}

async function run() {
  let rv = {};

  try {
    for (const repo of repos) {
      const data = await fetchCommits(makeQuery(repo));
      rv[repo] = data.sort(function(a, b) {
        return a.date < b.date ? 1 : -1;
      });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rv, null, 2));

    console.log(`Success at ${new Date()}`);
  } catch (e) {
    console.log(e);
    console.log(`Fail and exit at ${new Date()}`);
  }
}

run();
