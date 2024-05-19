const { $ } = require('@wdio/globals')
const assert = require('assert');
const Page = require('./page');
const { browser } = require('@wdio/globals');


class ProductPage extends Page {
    get btnBackToProducts(){
        return $('//button[@id="back-to-products"]')
    }
    clickBtnBackToProducts(){
        this.btnBackToProducts.click()
    }
    get itemImage() {
        return $(`//img[@class="inventory_details_img"]`);
    }
    get itemPrice() {
        return $(`//div[@class="inventory_details_price"]`);
    }
    get itemBtn() {
        return $(`//button[contains(@name,"add-to-cart") or contains(@name,"remove")]`);
    }
    clickItemBtn(){
        this.itemBtn.click()
    }
    get itemName() {
        return $(`//div[contains(@class,"details_name")]`);
    }
    get itemDesc() {
        return $(`//div[contains(@data-test,"item-desc")]`);
    }
    async verifyProductpageIsDisplayed(){
        assert.strictEqual(await (await this.btnBackToProducts).isDisplayed(), true)
        assert.strictEqual(await (await this.itemImage).isDisplayed(), true)
        assert.strictEqual(await (await this.itemDesc).isDisplayed(), true)
        assert.strictEqual(await (await this.itemName).isDisplayed(), true)
        assert.strictEqual(await (await this.itemPrice).isDisplayed(), true)
        assert.strictEqual(await (await this.itemBtn).isDisplayed(), true)

    }
}

module.exports = new ProductPage();