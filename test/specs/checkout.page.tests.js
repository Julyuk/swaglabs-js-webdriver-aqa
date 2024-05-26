const assert = require("assert");
const loginPage = require("../pageobjects/login.page");
const inventoryPage = require("../pageobjects/inventory.page");
const cartPage = require("../pageobjects/cart.page");
const checkoutPage = require("../pageobjects/checkout.page");
const overviewPage = require("../pageobjects/overview.page");

describe("Checkout page", () => {
  let expectedPrice, expectedDesc, expectedName, expectedQuantity;

  beforeEach(async () => {
    await loginPage.open();
    await loginPage.verifyLoginPageIsOpened();
    await loginPage.login(
      await loginPage.getAcceptedUsernameById(0),
      await loginPage.getPasswordForAll(),
    );
    await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed();
    await resetAppState();
    await inventoryPage.ensureItemNotInCart(0);
    await addItemToCart(0);
    await navigateToCheckout();
  });
  async function navigateToCheckout() {
    await cartPage.clickBtnCheckout();

    await browser.waitUntil(
      async () => await (await checkoutPage.firstNameInput).isDisplayed(),
      {
        timeout: 5000,
        timeoutMsg: "Expected checkout page to be displayed",
      },
    );
    await checkoutPage.verifyCheckoutMenuOpened();
  }
  async function addItemToCart(itemIndex) {
    expectedPrice = await (
      await inventoryPage.getItemPriceById(itemIndex)
    ).getText();
    expectedDesc = await (
      await inventoryPage.getItemDescById(itemIndex)
    ).getText();
    expectedName = await (
      await inventoryPage.getItemNameById(itemIndex)
    ).getText();
    expectedQuantity = 1;

    await inventoryPage.getItemBtnById(itemIndex).click();
    inventoryPage.clickBtnCart();
    await cartPage.assertCartPageIsDisplayed();
  }

  async function assertSideMenuIsDisplayed() {
    await inventoryPage.clickBurgerMenu();
    await browser.waitUntil(
      async () => await (await inventoryPage.allItems).isDisplayed(),
      {
        timeout: 5000,
        timeoutMsg: "Expected side menu to be displayed",
      },
    );
    await inventoryPage.verifySideMenuIsOpen();
  }

  async function closeSideMenu() {
    await inventoryPage.clickXButton();
    await browser.waitUntil(
      async function () {
        return (await (await inventoryPage.allItems).isDisplayed()) === false;
      },
      {
        timeout: 5000,
        timeoutMsg: "Expected side menu not to be displayed",
      },
    );
    await inventoryPage.verifySideMenuIsClosed();
  }

  async function resetAppState() {
    await assertSideMenuIsDisplayed();
    await inventoryPage.clickResetAppState();
    await closeSideMenu();
  }

  const checkoutTests = [
    {
      description: "with empty fields",
      firstName: "",
      lastName: "",
      postalCode: "",
      expectedError: checkoutPage.firstNameRequired,
    },
    {
      description: "with empty first name",
      firstName: "",
      lastName: checkoutPage.generateRandomValue("string", 3, 8),
      postalCode: checkoutPage.generateRandomValue("number", 101, 99999),
      expectedError: checkoutPage.firstNameRequired,
    },
    {
      description: "with empty last name",
      firstName: checkoutPage.generateRandomValue("string", 3, 8),
      lastName: "",
      postalCode: checkoutPage.generateRandomValue("number", 101, 99999),
      expectedError: checkoutPage.lastNameRequired,
    },
    {
      description: "with empty postal code",
      firstName: checkoutPage.generateRandomValue("string", 3, 8),
      lastName: checkoutPage.generateRandomValue("string", 3, 8),
      postalCode: "",
      expectedError: checkoutPage.postalCodeRequired,
    },
  ];

  checkoutTests.forEach((test) => {
    it(`Continue cart checkout ${test.description}`, async () => {
      if (test.firstName !== undefined)
        await (await checkoutPage.firstNameInput).setValue(test.firstName);
      if (test.lastName !== undefined)
        await (await checkoutPage.lastNameInput).setValue(test.lastName);
      if (test.postalCode !== undefined)
        await (await checkoutPage.postalCodeInput).setValue(test.postalCode);

      assert.strictEqual(
        await (await checkoutPage.firstNameInput).getAttribute("value"),
        test.firstName,
      );
      assert.strictEqual(
        await (await checkoutPage.lastNameInput).getAttribute("value"),
        test.lastName,
      );
      assert.strictEqual(
        await (await checkoutPage.postalCodeInput).getAttribute("value"),
        test.postalCode.toString(),
      );

      await checkoutPage.clickContinue();
      checkoutPage.assertInvalidCheckout(test.expectedError);
    });
  });

  it('Check "Cancel" button in the checkout page', async () => {
    checkoutPage.clickCancel();
    await cartPage.assertCartPageIsDisplayed();
    await verifyCartItemDetails(
      cartPage,
      expectedQuantity,
      expectedName,
      expectedDesc,
      expectedPrice,
    );
  });

  async function verifyCartItemDetails(
    page,
    expectedQuantity,
    expectedName,
    expectedDesc,
    expectedPrice,
  ) {
    assert.strictEqual(await page.cartItems.length, expectedQuantity);
    assert.strictEqual(
      await (await page.getItemNameById(0)).isDisplayed(),
      true,
    );
    assert.strictEqual(
      await (await page.getItemNameById(0)).getText(),
      expectedName,
    );
    assert.strictEqual(
      await (await page.getItemDescById(0)).isDisplayed(),
      true,
    );
    assert.strictEqual(
      await (await page.getItemDescById(0)).getText(),
      expectedDesc,
    );
    assert.strictEqual(
      await (await page.getItemPriceById(0)).isDisplayed(),
      true,
    );
    assert.strictEqual(
      await (await page.getItemPriceById(0)).getText(),
      expectedPrice,
    );
    assert.strictEqual(
      await (await page.getItemQuantityById(0)).isDisplayed(),
      true,
    );
    assert.strictEqual(
      parseInt(await (await page.getItemQuantityById(0)).getText()),
      expectedQuantity,
    );
  }

  it('Check "Cancel" button in the overview page', async () => {
    await (
      await checkoutPage.firstNameInput
    ).setValue(checkoutTests[3].firstName);
    await (
      await checkoutPage.lastNameInput
    ).setValue(checkoutTests[3].lastName);
    await (
      await checkoutPage.postalCodeInput
    ).setValue(checkoutTests[2].postalCode);
    await navigateToOverviewPage();
    overviewPage.clickBtnCancel();
    await inventoryPage.asssertInventoryPageCartAndItemsAreDisplayed();
    assert.strictEqual(
      parseInt(await (await inventoryPage.itemsInCartBadge).getText()),
      expectedQuantity,
    );
  });
  async function navigateToOverviewPage() {
    await checkoutPage.clickContinue();
    await browser.waitUntil(
      async function () {
        return await (await overviewPage.paymentInfoLabel).isDisplayed();
      },
      {
        timeout: 5000,
        timeoutMsg: "Expected overview page to be displayed",
      },
    );
    await overviewPage.assertOverviewPageIsDisplayed();
  }
});
