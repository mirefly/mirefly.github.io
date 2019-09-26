module.exports = {
  apps: [
    {
      name: 'mysite',
      script: 'npm',
      args: ['start'],
      watch: ['.'],
    },
  ],
};
