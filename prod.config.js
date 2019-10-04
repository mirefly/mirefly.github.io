module.exports = {
  apps: [
    {
      name: 'mysite',
      script: 'npm',
      args: ['run', 'prod'],
    },
    {
      name: 'updateCommitsData',
      script: 'node',
      args: ['./scripts/updateCommitsData.js'],
      cron_restart: '*/30 * * * *',
      autorestart: false,
    },
  ],
};
