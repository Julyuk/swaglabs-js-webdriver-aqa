const assert = require('assert');
const loginPage = require("../pageobjects/login.page")
const inventoryPage = require("../pageobjects/inventory.page")
describe('Login page', () => {
    beforeEach(async () => {
        await loginPage.open();
        const title = await browser.getTitle();
        await browser.waitUntil(
          async function () {
            return title === "Swag Labs";
          },
          {
            timeout: 5000,
            timeoutMsg:
              "expected text to be different after 5s and be strictly equal 'Swag Labs'",
          }
        );
        assert.strictEqual(title, "Swag Labs");
        const loginHeadingDisplayed = await (await loginPage.loginHeading).isDisplayed();
        assert.strictEqual(loginHeadingDisplayed, true);
    });
    it('Valid Login', async () => {
        loginPage.login(await loginPage.getAcceptedUsernameById(0), await loginPage.getPasswordForAll())
        await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
    });

    it('Login with invalid password', async () => {
        loginPage.login(await loginPage.getAcceptedUsernameById(0), await loginPage.generateRandomValue("number", 2,5)+loginPage.generateRandomValue("string", 3,5))
        await loginPage.assertInvalidLogin();
    });

    it('Login with invalid password', async () => {
        loginPage.login(await loginPage.generateRandomValue("number", 2,5)+loginPage.generateRandomValue("string", 3,5), await loginPage.getPasswordForAll())
        await loginPage.assertInvalidLogin();
    });
});
