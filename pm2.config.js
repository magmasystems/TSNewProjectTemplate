module.exports = {
  apps: [
    {
      name: 'TSNewProjectTemplate',
      script: './dist/main.js',
      env: {
        COMMON_VARIABLE: 'true',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
