import { defineConfig } from "cypress";

const browserify = require("@cypress/browserify-preprocessor");
const cucumber = require("cypress-cucumber-preprocessor").default;
const resolve = require("resolve");

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "features/**/*.feature",
    supportFile: false,
    setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions,
    ) {
      const options = {
        ...browserify.defaultOptions,
        typescript: resolve.sync("typescript", { baseDir: config.projectRoot }),
      };
      on("file:preprocessor", cucumber(options));

      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push(
            "--disable-features=PasswordLeakDetection",
            "--disable-save-password-bubble",
          );
          launchOptions.preferences.default = {
            ...launchOptions.preferences.default,
            credentials_enable_service: false,
            profile: {
              ...launchOptions.preferences.default?.profile,
              password_manager_enabled: false,
              password_manager_leak_detection: false,
            },
          };
        }
        return launchOptions;
      });

      return config;
    },
  },
});