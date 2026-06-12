module.exports = {
  apps: [{
    name: 'visitor-api',
    script: './server.cjs',
    env: {
      VISITORS_SECRET: '5f0d02bd2ea8ca608210e81b8c0471e4',
      PORT: '3003',
    },
  }],
};
