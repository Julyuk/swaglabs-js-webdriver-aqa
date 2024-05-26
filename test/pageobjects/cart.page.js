const { $ } = require("@wdio/globals");
const assert = require("assert");
const Page = require("./page");
const { browser } = require("@wdio/globals");

class CartPage extends Page {
  get yourCartHeading() {
    return $('//span[contains(@class,"title")]');
  }
  get quantity() {
    return $('//div[contains(@class,"quantity_label")]');
  }
  get description() {
    return $('//div[contains(@class,"desc_label")]');
  }
  get btnContinueShopping() {
    return $('//button[contains(@name,"continue")]');
  }
  clickBtnContinueShopping() {
    this.btnContinueShopping.click();
  }
  get btnCheckout() {
    return $('//button[contains(@name,"checkout")]');
  }
  clickBtnCheckout() {
    this.btnCheckout.click();
  }
  get cartItems() {
    return $$(
      '//div[contains(@data-test,"inventory-item") and contains(@class,"cart_item")]',
    );
  }

  cartItemById(id) {
    const items = this.cartItems;
    if (id >= 0 && id < items.length) {
      return items[id];
    } else {
      throw new Error("Invalid ID provided");
    }
  }
  getItemPriceById(id) {
    return $(`(//div[@class="inventory_item_price"])[${id + 1}]`);
  }

  getItemNameById(id) {
    return $(`(//div[contains(@class,"item_name")])[${id + 1}]`);
  }
  getItemDescById(id) {
    return $(`(//div[@class="inventory_item_desc"])[${id + 1}]`);
  }
  getItemBtnById(id) {
    return $(`(//button[ contains(@name,"remove")])[${id + 1}]`);
  }
  getItemQuantityById(id) {
    return $(`(//div[@class="cart_quantity"])[${id + 1}]`);
  }
  async assertCartPageIsDisplayed() {
    assert.strictEqual(await (await this.yourCartHeading).isDisplayed(), true);
    assert.strictEqual(
      await (await this.btnContinueShopping).isDisplayed(),
      true,
    );
    assert.strictEqual(await (await this.btnCheckout).isDisplayed(), true);
    assert.strictEqual(await (await this.quantity).isDisplayed(), true);
    assert.strictEqual(await (await this.description).isDisplayed(), true);
  }
  get errorMsg() {
    return $('//*[@data-test="error"]');
  }
}

module.exports = new CartPage();
