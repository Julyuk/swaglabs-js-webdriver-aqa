const { $ } = require("@wdio/globals");
const assert = require("assert");
const Page = require("./page");
const { browser } = require("@wdio/globals");

class CheckoutPage extends Page {
  constructor() {
    super();
    this.firstNameRequired = "Error: First Name is required";
    this.lastNameRequired = "Error: Last Name is required";
    this.postalCodeRequired = "Error: Postal Code is required";
  }
  get btnCancel() {
    return $("#cancel");
  }
  clickCancel() {
    this.btnCancel.click();
  }
  get btnContinue() {
    return $("#continue");
  }
  clickContinue() {
    this.btnContinue.click();
  }
  get firstNameInput() {
    return $('//input[@id="first-name"]');
  }
  get lastNameInput() {
    return $('//input[@id="last-name"]');
  }
  get postalCodeInput() {
    return $('//input[@id="postal-code"]');
  }
  async verifyCheckoutMenuOpened() {
    assert.strictEqual(await (await this.btnCancel).isDisplayed(), true);
    assert.strictEqual(await (await this.btnContinue).isDisplayed(), true);
    assert.strictEqual(await (await this.firstNameInput).isDisplayed(), true);
    assert.strictEqual(await (await this.lastNameInput).isDisplayed(), true);
    assert.strictEqual(await (await this.postalCodeInput).isDisplayed(), true);
  }
  get errorMsg() {
    return $('//h3[@data-test="error"]');
  }

  get errorIcons() {
    return $$("svg.error_icon");
  }
  async assertInvalidCheckout(errorMsg) {
    const actualErrorMsg = await (await this.errorMsg).getText();
    assert.strictEqual(actualErrorMsg, errorMsg);
    const errorIcons = await this.errorIcons;
    assert.strictEqual(errorIcons.length, 3);
    for (const icon of errorIcons) {
      const isDisplayed = await icon.isDisplayed();
      const iconColor = await (await icon.getCSSProperty("color")).value;
      assert.strictEqual(isDisplayed, true);
      assert.strictEqual(iconColor, "rgba(226,35,26,1)");
    }
    assert.strictEqual(await (await this.errorMsg).isDisplayed(), true);
    assert.strictEqual(
      (await (await this.firstNameInput).getCSSProperty("border-bottom-color"))
        .value,
      "rgba(226,35,26,1)",
    );
    assert.strictEqual(
      (await (
        await this.lastNameInput.getCSSProperty("border-bottom-color")
      ).value,
      "rgba(226,35,26,1)"),
    );
    assert.strictEqual(
      (await (
        await this.postalCodeInput.getCSSProperty("border-bottom-color")
      ).value,
      "rgba(226,35,26,1)"),
    );
  }
}

module.exports = new CheckoutPage();
