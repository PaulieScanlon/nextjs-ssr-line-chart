import React from 'react';

import LineChart from '../components/line-chart';

const Page = ({ results }) => {
  return (
    <section className="grid gap-4">
      <div>
        <h1 className="m-0 text-cetner text-zinc-100">Next.js Repository Activity</h1>
        <p className="m-0 text-zinc-300">Returns the last year of commit activity grouped by week</p>
      </div>
      <div className="border border-zinc-800 rounded-lg p-2 sm:p-4">
        <LineChart data={results} />
      </div>
    </section>
  );
};

export const getServerSideProps = async () => {
  const { Octokit } = require('octokit');

  const octokit = new Octokit({ auth: process.env.OCTOKIT_PERSONAL_ACCESS_TOKEN });

  try {
    // https://docs.github.com/en/rest/metrics/statistics#get-the-last-year-of-commit-activity
    const response = await octokit.request('GET /repos/{owner}/{repo}/stats/commit_activity', {
      owner: 'vercel',
      repo: 'next.js'
    });

    if (response.status === 200) {
      const results = response.data.map((result) => {
        const { total, week } = result;
        return {
          total: total,
          date: String(new Date(week * 1000))
        };
      });

      return {
        props: {
          results: results
        }
      };
    } else {
      throw new Error('Octokit Error');
    }
  } catch (error) {
    return {
      props: {
        error: error
      }
    };
  }
};

export default Page;
