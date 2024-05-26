const assert = require('assert');
const loginPage = require("../pageobjects/login.page")
const inventoryPage = require("../pageobjects/inventory.page")

describe('Login page', () => {
    beforeEach(async () => {
        await loginPage.open()
        await loginPage.verifyLoginPageIsOpened()
    });

    const loginAndAssert = async (username, password, expectedError = null) => {
        await loginPage.login(username, password);
        if (expectedError) {
            await loginPage.assertInvalidLogin(expectedError);
        } else {
            await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
        }
    };

    it('Valid Login', async () => {
        await loginAndAssert(await loginPage.getAcceptedUsernameById(0), await loginPage.getPasswordForAll());
    });

    it('Login with invalid password', async () => {
        const invalidPassword = await loginPage.generateRandomValue("number", 2, 5) + await loginPage.generateRandomValue("string", 3, 5);
        await loginAndAssert(await loginPage.getAcceptedUsernameById(0), invalidPassword, loginPage.errorUsernameAndPwdDoNotMAtch);
    });

    it('Login with invalid login', async () => {
        const invalidUsername = await loginPage.generateRandomValue("number", 2, 5) + await loginPage.generateRandomValue("string", 3, 5);
        await loginAndAssert(invalidUsername, await loginPage.getPasswordForAll(), loginPage.errorUsernameAndPwdDoNotMAtch);
    });

    it('Login with empty fields', async () => {
        await loginAndAssert('', '', loginPage.userNameRequired);
    });

    it('Login with empty username field', async () => {
        await loginAndAssert('', await loginPage.getPasswordForAll(), loginPage.userNameRequired);
    });

    it('Login with empty password field', async () => {
        await loginAndAssert(await loginPage.getAcceptedUsernameById(0), '', loginPage.pwdRequired);
    });

    it('Login with locked out user', async () => {
        await loginAndAssert(await loginPage.getAcceptedUsernameById(1), await loginPage.getPasswordForAll(), loginPage.lockedOutUser);
    });
});
