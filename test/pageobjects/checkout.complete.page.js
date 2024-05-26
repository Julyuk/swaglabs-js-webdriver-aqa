const { $ } = require("@wdio/globals");
const assert = require("assert");
const Page = require("./page");
const { browser } = require("@wdio/globals");

class CheckoutCompletePage extends Page {
  constructor() {
    super();
    this.thankYouHeadingText = "Thank you for your order!";
  }
  get checkIcon() {
    return $('//img[@data-test="pony-express"]');
  }
  get thankYouHeading() {
    return $('//h2[@data-test="complete-header"]');
  }
  get thankYouMainText() {
    return $('//div[@data-test="complete-text"]');
  }
  get btnBackHome() {
    return $('//button[@id="back-to-products"]');
  }
  clickBtnBackHome() {
    this.btnBackHome.click();
  }
  async verifyCheckoutCompletePageItemsAreDisplayed() {
    assert.strictEqual(await (await this.checkIcon).isDisplayed(), true);
    assert.strictEqual(await (await this.thankYouMainText).isDisplayed(), true);
    assert.strictEqual(await (await this.btnBackHome).isDisplayed(), true);
    assert.strictEqual(await (await this.thankYouHeading).isDisplayed(), true);
  }
}

module.exports = new CheckoutCompletePage();
