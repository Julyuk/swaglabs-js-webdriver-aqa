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
        await browser.waitUntil(async () => {
            const cartIsDisplayed = await inventoryPage.btnCart.isDisplayed()
            assert.strictEqual(cartIsDisplayed, true)
            return cartIsDisplayed
        }, {
            timeout: 5000,
            timeoutMsg: 'expected inventory container to be displayed after 5s'
        });
        const itemsCount = await inventoryPage.items.length
        assert.strictEqual(itemsCount, 6)
        for(let i = 0; i < await inventoryPage.items.length; i++){
            assert.strictEqual(await (await inventoryPage.getItemImageById(i)).isDisplayed(), true)
            assert.strictEqual(await (await inventoryPage.getItemPriceById(i)).isDisplayed(), true)
            assert.strictEqual(await (await inventoryPage.getItemBtnById(i)).isDisplayed(), true)
            assert.strictEqual(await (await inventoryPage.getItemNameById(i)).isDisplayed(), true)
            assert.strictEqual(await (await inventoryPage.getItemDescById(i)).isDisplayed(), true)
            
        }
    });

    it('Login with invalid password', async () => {
        loginPage.login(await loginPage.getAcceptedUsernameById(0), await loginPage.getPasswordForAll())
    });
});
