const report = require("multiple-cucumber-html-reporter");
const { name, version } = require("../package.json");

report.generate({
  jsonDir: "reports/cucumber-json",
  reportPath: "reports/cucumber-html",
  displayDuration: true,
  displayReportTime: true,
  pageTitle: "Cypress BDD Report",
  reportName: "Cypress BDD Test Report",
  metadata: {
    browser: {
      name: "chrome",
      version: "latest",
    },
    device: "Local test machine",
    platform: {
      name: process.platform,
      version: process.version,
    },
  },
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: name },
      { label: "Version", value: version },
      { label: "Framework", value: "Cypress BDD" },
    ],
  },
});
