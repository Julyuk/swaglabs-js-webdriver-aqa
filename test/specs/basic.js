const assert = require('assert');
const loginPage = require("../pageobjects/login.page")
const inventoryPage = require("../pageobjects/inventory.page")
const cartPage = require("../pageobjects/cart.page")
const checkoutPage = require('../pageobjects/checkout.page')
const overviewPage = require("../pageobjects/overview.page")
const checkoutCompletePage = require('../pageobjects/checkout.complete.page')
const productPage = require('../pageobjects/product.page')


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

describe('Inventory page', () => {
    beforeEach(async () => {
        await loginPage.open()
        await loginPage.verifyLoginPageIsOpened()
        loginPage.login(await loginPage.getAcceptedUsernameById(0), await loginPage.getPasswordForAll())
        await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
    });

    async function assertSideMenuIsDisplayed() {
        await inventoryPage.clickBurgerMenu();
        await browser.waitUntil(
            async () => await (await inventoryPage.allItems).isDisplayed(),
            {
                timeout: 5000,
                timeoutMsg: "Expected side menu to be displayed",
            }
        );
        await inventoryPage.verifySideMenuIsOpen();
    }

    async function loginAndVerifyCart(expectedQuantity, expectedName, expectedDesc, expectedPrice) {
        await loginPage.login(await loginPage.getAcceptedUsernameById(0), await loginPage.getPasswordForAll());
        await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
        await inventoryPage.clickBtnCart();
        await cartPage.assertCartPageIsDisplayed();
        assert.strictEqual((await cartPage.cartItems.length), expectedQuantity);
        assert.strictEqual(await (await cartPage.getItemNameById(0)).getText(), expectedName);
        assert.strictEqual(await (await cartPage.getItemDescById(0)).getText(), expectedDesc);
        assert.strictEqual(await (await cartPage.getItemPriceById(0)).getText(), expectedPrice);
        assert.strictEqual(parseInt(await (await cartPage.getItemQuantityById(0)).getText()), expectedQuantity);
    }

    it('Logout', async () => {
        await assertSideMenuIsDisplayed();
        await inventoryPage.clickLogout();
        await loginPage.verifyLoginPageIsOpened();
        await loginPage.verifyInputFieldsAreEmpty();
    });
    
    it('Saving cart after logout', async () => { 
        const expectedPrice = await (await inventoryPage.getItemPriceById(0)).getText();
        const expectedDesc = await (await inventoryPage.getItemDescById(0)).getText();
        const expectedName = await (await inventoryPage.getItemNameById(0)).getText();
        const expectedQuantity = 1;
        await inventoryPage.getItemBtnById(0).click();
        assert.strictEqual(parseInt(await (await inventoryPage.itemsInCartBadge).getText()), expectedQuantity);
        await assertSideMenuIsDisplayed();
        await inventoryPage.clickLogout();
        await loginPage.verifyLoginPageIsOpened();
        await loginPage.verifyInputFieldsAreEmpty();
        await loginAndVerifyCart(expectedQuantity, expectedName, expectedDesc, expectedPrice);
        await cartPage.getItemBtnById(0).click();
    });

    it('Sorting products', async () => {  
        const filterOptions = ["za", "az", "hilo", "lohi"];
        for (const option of filterOptions) {
            await inventoryPage.sortByValue(option);
            let prevValue;

            switch(option) {
                case "hilo":
                case "lohi":
                    prevValue = parseFloat(await (await inventoryPage.getItemPriceById(0)).getText());
                    for (let j = 1; j < await inventoryPage.allItems.length; j++) {
                        const currentValue = parseFloat(await (await inventoryPage.getItemPriceById(j)).getText());
                        assert(option === "hilo" ? currentValue <= prevValue : currentValue >= prevValue, `The items aren't sorted properly by price (${option})`);
                        prevValue = currentValue;
                    }
                    break;
                    
                case "za":
                case "az":
                    prevValue = await (await inventoryPage.getItemNameById(0)).getText();
                    for (let j = 1; j < await inventoryPage.allItems.length; j++) {
                        const currentValue = await (await inventoryPage.getItemNameById(j)).getText();
                        assert(option === "za" ? currentValue <= prevValue : currentValue >= prevValue, `The items aren't sorted properly by name (${option})`);
                        prevValue = currentValue;
                    }
                    break;
            }
        }
    });

    it('Footer links', async () => { 
        inventoryPage.clickTwitterBtn()
        await inventoryPage.checkSocialLinkIsOpenedInANewTabAndSwitchToSite("https://x.com/saucelabs")
        inventoryPage.clickFacebookBtn()
        await inventoryPage.checkSocialLinkIsOpenedInANewTabAndSwitchToSite("https://www.facebook.com/saucelabs")
        inventoryPage.clickLinkedInBtn()
        await inventoryPage.checkSocialLinkIsOpenedInANewTabAndSwitchToSite("https://www.linkedin.com/company/sauce-labs/")
    });

    it('Valid Checkout', async () => { 
        const expectedPrice = await (await inventoryPage.getItemPriceById(0)).getText()
        const expectedDesc = await (await inventoryPage.getItemDescById(0)).getText()
        const expectedName= await (await inventoryPage.getItemNameById(0)).getText()
        const expectedQuantity = 1
        inventoryPage.getItemBtnById(0).click()
        assert.strictEqual(parseInt(await (await inventoryPage.itemsInCartBadge).getText()), expectedQuantity);
        inventoryPage.clickBtnCart()
        await cartPage.assertCartPageIsDisplayed()
        assert.strictEqual((await cartPage.cartItems.length), expectedQuantity)
        assert.strictEqual(await (await cartPage.getItemNameById(0)).isDisplayed(), true)
        assert.strictEqual(await (await cartPage.getItemNameById(0)).getText(), expectedName)
        assert.strictEqual(await (await cartPage.getItemDescById(0)).isDisplayed(), true)
        assert.strictEqual(await (await cartPage.getItemDescById(0)).getText(), expectedDesc)
        assert.strictEqual(await (await cartPage.getItemPriceById(0)).isDisplayed(), true)
        assert.strictEqual(await(await cartPage.getItemPriceById(0)).getText(), expectedPrice)
        assert.strictEqual(await(await cartPage.getItemQuantityById(0)).isDisplayed(), true)
        assert.strictEqual(parseInt(await(await cartPage.getItemQuantityById(0)).getText()), expectedQuantity)
        cartPage.clickBtnCheckout()
        await browser.waitUntil(
            async function () {
                return await (await checkoutPage.firstNameInput).isDisplayed()
            },
            {
                timeout: 5000,
                timeoutMsg:
                "Expected checkout page to be displayed",
            }
        );
        await checkoutPage.verifyCheckoutMenuOpened()
        const randomFName = checkoutPage.generateRandomValue('string', 3, 8)
        const randomLName = checkoutPage.generateRandomValue('string', 3, 8)
        const randomPCode= checkoutPage.generateRandomValue('number', 101, 99999)
        await (await checkoutPage.firstNameInput).setValue(randomFName)
        await (await checkoutPage.lastNameInput).setValue(randomLName)
        await (await checkoutPage.postalCodeInput).setValue(randomPCode)
        assert.strictEqual(await (await checkoutPage.firstNameInput).getAttribute("value"), randomFName)
        assert.strictEqual(await (await checkoutPage.lastNameInput).getAttribute("value"), randomLName)
        assert.strictEqual(parseInt(await (await checkoutPage.postalCodeInput).getAttribute("value")), randomPCode)
        await checkoutPage.clickContinue()
        await browser.waitUntil(
            async function () {
                return await (await overviewPage.paymentInfoLabel).isDisplayed()
            },
            {
                timeout: 5000,
                timeoutMsg:
                "Expected overview page to be displayed",
            }
        );
        await overviewPage.assertOverviewPageIsDisplayed()
        assert.strictEqual((await overviewPage.cartItems.length), expectedQuantity)
        assert.strictEqual(await (await overviewPage.getItemNameById(0)).isDisplayed(), true)
        assert.strictEqual(await (await overviewPage.getItemNameById(0)).getText(), expectedName)
        assert.strictEqual(await (await overviewPage.getItemDescById(0)).isDisplayed(), true)
        assert.strictEqual(await (await overviewPage.getItemDescById(0)).getText(), expectedDesc)
        assert.strictEqual(await (await overviewPage.getItemPriceById(0)).isDisplayed(), true)
        assert.strictEqual(await(await overviewPage.getItemPriceById(0)).getText(), expectedPrice)
        assert.strictEqual(await(await overviewPage.getItemQuantityById(0)).isDisplayed(), true)
        assert.strictEqual(parseInt(await(await overviewPage.getItemQuantityById(0)).getText()), expectedQuantity)
        assert.strictEqual(await (await overviewPage.subtotalLabel).getText(), `Item total: ${expectedPrice}`)
        overviewPage.clickBtnFinish()
        await browser.waitUntil(
            async function () {
                return await (await checkoutCompletePage.thankYouHeading).isDisplayed()
            },
            {
                timeout: 5000,
                timeoutMsg:
                "Expected checkout complete page to be displayed",
            }
        );
        await checkoutCompletePage.verifyCheckoutCompletePageItemsAreDisplayed()
        assert.strictEqual(await (await checkoutCompletePage.thankYouHeading).getText(), checkoutCompletePage.thankYouHeadingText)
        checkoutCompletePage.clickBtnBackHome()
        await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
        assert.strictEqual(await inventoryPage.cartItems, undefined)
    });

    it('Checkout without products', async () => { 
        inventoryPage.clickBtnCart()
        await cartPage.assertCartPageIsDisplayed()
        cartPage.clickBtnCheckout()
        await cartPage.assertCartPageIsDisplayed()
        assert.strictEqual(await (await cartPage.errorMsg).getText(), "Cart is empty")
    });

    it('Check "About" link in the side menu', async () => { 
        await assertSideMenuIsDisplayed();
        await inventoryPage.clickAbout();
        inventoryPage.checkSocialLinkIsOpenedInANewTabAndSwitchToSite('https://saucelabs.com/')
    });
    it('Reset app state', async () => { 
        const expectedQuantity = 1;
        await inventoryPage.getItemBtnById(0).click();
        assert.strictEqual(parseInt(await (await inventoryPage.itemsInCartBadge).getText()), expectedQuantity);
        await assertSideMenuIsDisplayed();
        await inventoryPage.clickResetAppState();
        assert.strictEqual(await inventoryPage.cartItems, undefined);
    });
    it('Check "All items" link in the side menu', async () => { 
        await inventoryPage.getItemBtnById(0).click();
        await inventoryPage.clickBtnCart();
        await cartPage.assertCartPageIsDisplayed();
        await assertSideMenuIsDisplayed();
        cartPage.clickAllItems();
        await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
    });
    it('Check "X" button in the side menu', async () => { 
        await assertSideMenuIsDisplayed();
        await inventoryPage.clickXButton()
        await browser.waitUntil(
            async function () {
                return await (await inventoryPage.allItems).isDisplayed()===false
            },
            {
                timeout: 5000,
                timeoutMsg:
                "Expected side menu not to be displayed",
            }
        );
       await inventoryPage.verifySideMenuIsClosed()
    });
    
    it('Check "Continue shopping" button in the cart', async () => { 
        const expectedQuantity = 1
        await inventoryPage.getItemBtnById(0).click()
        assert.strictEqual(parseInt(await (await inventoryPage.itemsInCartBadge).getText()), expectedQuantity);
        await inventoryPage.clickBtnCart()
        await cartPage.assertCartPageIsDisplayed()
        await cartPage.clickBtnContinueShopping()
        await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
        assert.strictEqual(parseInt(await (await inventoryPage.itemsInCartBadge).getText()), expectedQuantity)
        await assertSideMenuIsDisplayed();
        await inventoryPage.clickResetAppState()
    });

    it('Check product page and return back to products', async () => { 
        for(let i = 0; i < await inventoryPage.allItems.length; i++){
            let expectedPrice = await (await inventoryPage.getItemPriceById(i)).getText()
        let expectedDesc = await (await inventoryPage.getItemDescById(i)).getText()
        let expectedName= await (await inventoryPage.getItemNameById(i)).getText()
        let expectedImg= await (await inventoryPage.getItemImageById(i)).getAttribute('src')
        await inventoryPage.getItemNameById(i).click()
        await productPage.verifyProductpageIsDisplayed()
        assert.strictEqual(await (await productPage.itemImage).getAttribute('src'), expectedImg)
        assert.strictEqual(await (await productPage.itemDesc).getText(), expectedDesc)
        assert.strictEqual(await (await productPage.itemName).getText(), expectedName)
        assert.strictEqual(await (await productPage.itemPrice).getText(), expectedPrice)
        await productPage.clickBtnBackToProducts()
        await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
        }
    });
});


describe('Checkout page', () => {
    let expectedPrice, expectedDesc, expectedName, expectedQuantity;

    beforeEach(async () => {
        await loginPage.open();
        await loginPage.verifyLoginPageIsOpened();
        await loginPage.login(await loginPage.getAcceptedUsernameById(0), await loginPage.getPasswordForAll());
        await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
        
        expectedPrice = await (await inventoryPage.getItemPriceById(0)).getText();
        expectedDesc = await (await inventoryPage.getItemDescById(0)).getText();
        expectedName = await (await inventoryPage.getItemNameById(0)).getText();
        expectedQuantity = 1;
        
        await inventoryPage.getItemBtnById(0).click();
        await inventoryPage.clickBtnCart();
        await cartPage.assertCartPageIsDisplayed();
        await cartPage.clickBtnCheckout();

        await browser.waitUntil(
            async () => await (await checkoutPage.firstNameInput).isDisplayed(),
            {
                timeout: 5000,
                timeoutMsg: "Expected checkout page to be displayed",
            }
        );
        await checkoutPage.verifyCheckoutMenuOpened();
    });

    const checkoutTests = [
        {
            description: 'with empty fields',
            firstName: '',
            lastName: '',
            postalCode: '',
            expectedError: checkoutPage.firstNameRequired,
        },
        {
            description: 'with empty first name',
            firstName: '',
            lastName: checkoutPage.generateRandomValue('string', 3, 8),
            postalCode: checkoutPage.generateRandomValue('number', 101, 99999),
            expectedError: checkoutPage.firstNameRequired,
        },
        {
            description: 'with empty last name',
            firstName: checkoutPage.generateRandomValue('string', 3, 8),
            lastName: '',
            postalCode: checkoutPage.generateRandomValue('number', 101, 99999),
            expectedError: checkoutPage.lastNameRequired,
        },
        {
            description: 'with empty postal code',
            firstName: checkoutPage.generateRandomValue('string', 3, 8),
            lastName: checkoutPage.generateRandomValue('string', 3, 8),
            postalCode: '',
            expectedError: checkoutPage.postalCodeRequired,
        },
    ];

    checkoutTests.forEach(test => {
        it(`Continue cart checkout ${test.description}`, async () => {
            if (test.firstName !== undefined) await (await checkoutPage.firstNameInput).setValue(test.firstName);
            if (test.lastName !== undefined) await (await checkoutPage.lastNameInput).setValue(test.lastName);
            if (test.postalCode !== undefined) await (await checkoutPage.postalCodeInput).setValue(test.postalCode);

            assert.strictEqual(await (await checkoutPage.firstNameInput).getAttribute('value'), test.firstName);
            assert.strictEqual(await (await checkoutPage.lastNameInput).getAttribute('value'), test.lastName);
            assert.strictEqual(await (await checkoutPage.postalCodeInput).getAttribute('value'), test.postalCode.toString());

            await checkoutPage.clickContinue();
            checkoutPage.assertInvalidCheckout(test.expectedError)
        });
    });

    it('Check "Cancel" button in the checkout page', async () => { 
        checkoutPage.clickCancel()
        await cartPage.assertCartPageIsDisplayed();
    });

    it('Check "Cancel" button in the overview page', async () => { 
        await (await checkoutPage.firstNameInput).setValue(checkoutTests[3].firstName);
        await (await checkoutPage.lastNameInput).setValue(checkoutTests[3].lastName);
        await (await checkoutPage.postalCodeInput).setValue(checkoutTests[2].postalCode);
        await checkoutPage.clickContinue()
        await browser.waitUntil(
            async function () {
                return await (await overviewPage.paymentInfoLabel).isDisplayed()
            },
            {
                timeout: 5000,
                timeoutMsg:
                "Expected overview page to be displayed",
            }
        );
        await overviewPage.assertOverviewPageIsDisplayed()
        overviewPage.clickBtnCancel()
        await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed()
        assert.strictEqual(parseInt(await (await inventoryPage.itemsInCartBadge).getText()), expectedQuantity)
    });
});
