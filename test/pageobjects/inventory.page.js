const { $ } = require('@wdio/globals')
const assert = require('assert');
const Page = require('./page');
const { browser } = require('@wdio/globals')

class InventoryPage extends Page {
  get items() {
    return $$(`//div[@data-test="inventory-item"]`);
  }

  open() {
    return super.open("inventory.html");
  }
  getItemById(id) {
    return $(`(//div[@data-test="inventory-item"])[${id + 1}]`);
  }
  getItemImageById(id) {
    return $(`(//img[@class="inventory_item_img"])[${id + 1}]`);
  }
  getItemPriceById(id) {
    return $(`(//div[@class="inventory_item_price"])[${id + 1}]`);
  }
  getItemBtnById(id) {
    return $(`(//button[contains(@name,"add-to-cart") or contains(@name,"remove")])[${id + 1}]`);
  }
  getItemNameById(id) {
    return $(`(//div[contains(@class,"item_name")])[${id + 1}]`);
  }
  getItemDescById(id) {
    return $(`(//div[@class="inventory_item_desc"])[${id + 1}]`);
  }
  async asssertInventoryPageCartAndItemsAreDisplayed(){
    await browser.waitUntil(async () => {
                 const cartIsDisplayed = await this.btnCart.isDisplayed()
                 assert.strictEqual(cartIsDisplayed, true)
                 return cartIsDisplayed
             }, {
                 timeout: 5000,
                 timeoutMsg: 'expected inventory container to be displayed after 5s'
             });
             const itemsCount = await this.items.length
             assert.strictEqual(itemsCount, 6)
             for(let i = 0; i < await this.items.length; i++){
                 assert.strictEqual(await (await this.getItemImageById(i)).isDisplayed(), true)
                 assert.strictEqual(await (await this.getItemPriceById(i)).isDisplayed(), true)
                 assert.strictEqual(await (await this.getItemBtnById(i)).isDisplayed(), true)
                 assert.strictEqual(await (await this.getItemNameById(i)).isDisplayed(), true)
                 assert.strictEqual(await (await this.getItemDescById(i)).isDisplayed(), true)    
        }
  }

}

module.exports = new InventoryPage();
