exports.config = {
  runner: "local",
  specs: ["./test/specs/**/*.js"],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    {
      browserName: "chrome",
    },
  ],
  logLevel: "info",
  bail: 0,
  baseUrl: "https://www.saucedemo.com",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [],
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries },
  ) {
    if (!passed) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `ERROR_${test.title}_${timestamp}.png`;
      await browser.saveScreenshot(`./screenshots/${filename}`);
    }
  },
};
