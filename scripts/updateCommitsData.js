#!/usr/bin/env node
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const queryString = require('query-string');

const URL_COMMITS = 'https://api.github.com/search/commits?';
const OUTPUT_PATH = path.resolve(__dirname, '../data/commits.json');

function makeQuery(repo) {
  return queryString.stringify(
    {q: `repo:${repo}+author:mirefly`},
    {encode: false},
  );
}

repos = [
  'mozilla/addons-code-manager',
  'mozilla/addons-frontend',
  'mozilla/fxa',
  'mozilla/application-services',
];

async function fetchCommitsOnePage(url) {
  console.log(`fetching commits at ${url}`);

  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.cloak-preview',
    },
  });

  if (!resp.ok) {
    throw Error(`The Response is not OK: ${resp.status} at ${url} `);
  }

  let data = await resp.json();

  data = data.items.map(v => ({
    sha: v.sha,
    htmlUrl: v.html_url,
    date: v.commit.author.date,
    message: v.commit.message,
  }));

  const linksString = resp.headers.get('link');
  return {data, next: linksString && getNextUrl(linksString)};
}

const getNextUrl = linksString => {
  const links = linksString.split(',');
  const nextLink = links.filter(link => link.includes('rel="next"'));

  return nextLink.length > 0 ? nextLink[0].match(/\<(.*?)\>/)[1] : null;
};

async function fetchCommits(url) {
  const {data, next} = await fetchCommitsOnePage(url);
  let newData = [];

  if (next) {
    newData = await fetchCommits(next);
  }

  return data.concat(newData);
}

async function run() {
  let rv = {};

  try {
    for (const repo of repos) {
      const data = await fetchCommits(URL_COMMITS + makeQuery(repo));
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

module.exports = {
  getNextUrl,
};

if (require.main === module) {
  run();
}
