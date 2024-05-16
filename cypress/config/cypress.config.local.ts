import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "**/*.cy.ts",
    screenshotsFolder: "cypress/screenshots",
    screenshotOnRunFailure: true,
    videosFolder: "cypress/videos",
    video: true,
    trashAssetsBeforeRuns: true,
  },
});
