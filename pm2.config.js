module.exports = {
  apps: [
    {
      name: 'MyProject',
      script: './dist/app.js',
      env: {
        COMMON_VARIABLE: 'true',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
