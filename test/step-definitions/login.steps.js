const { Given, When, Then } = require("@wdio/cucumber-framework");
const loginPage = require("../pageobjects/login.page");

Given("User is located on the main page of the saucedemo website", async () => {
  await loginPage.open();
  await loginPage.verifyLoginPageIsOpened();
});

When('User clicks the "Login" button', async () => {
  loginPage.clickBtnLogin();
});

Then(
  'User should see the "Epic sadface: Username is required" error message',
  async () => {
    await loginPage.assertInvalidLogin(loginPage.userNameRequired);
  },
);
