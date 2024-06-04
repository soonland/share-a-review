import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://share-a-review-git-database-init-jonathan-langlois-projects.vercel.app/",
    specPattern: "**/*.cy.ts",
    screenshotsFolder: "cypress/screenshots",
    screenshotOnRunFailure: true,
    videosFolder: "cypress/videos",
    video: true,
    trashAssetsBeforeRuns: true,
  },
});
