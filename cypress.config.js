const { defineConfig } = require('cypress');

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'automacao/cypress/e2e/**/*.cy.js',
    supportFile: false,
    screenshotsFolder: 'automacao/cypress/screenshots',
    videosFolder: 'automacao/cypress/videos',
    video: false,
  },
});
