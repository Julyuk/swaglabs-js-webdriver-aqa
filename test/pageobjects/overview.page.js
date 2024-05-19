const { $ } = require('@wdio/globals')
const assert = require('assert');
const Page = require('./page');
const { browser } = require('@wdio/globals');


class OverviewPage extends Page {
   get paymentInfoLabel(){
    return $('//div[contains(@data-test,"payment-info-label")]')
   }

   get paymentInfoValue(){
    return $('//div[contains(@data-test,"payment-info-value")]')
   }

   get shippingInfoLabel(){
    return $('//div[contains(@data-test,"shipping-info-label")]')
   }

   get shippingInfoValue(){
    return $('//div[contains(@data-test,"shipping-info-value")]')
   }

   get totalInfoLabel(){
    return $('//div[contains(@data-test,"total-info-label")]')
   }

   get subtotalLabel(){
    return $('//div[contains(@data-test,"subtotal-label")]')
   }

   get taxLabel(){
    return $('//div[contains(@data-test,"tax-label")]')
   }

   get totalLabel(){
    return $('//div[contains(@class,"summary_total_label")]')
   }

   get btnFinish(){
    return $('//button[contains(@name,"finish")]')
}
clickBtnFinish(){
    this.btnFinish.click()
}
get btnCancel(){
    return $('//button[contains(@name,"cancel")]')
}
clickBtnCancel(){
    this.btnCancel.click()
}
get cartItems(){
    return $$('//div[contains(@data-test,"inventory-item") and contains(@class,"cart_item")]')
}


cartItemById(id) {
    const items = this.cartItems
    if (id >= 0 && id < items.length) {
        return items[id];
    } else {
        throw new Error('Invalid ID provided');
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

getItemQuantityById(id) {
return $(`(//div[@class="cart_quantity"])[${id + 1}]`);
}
async assertOverviewPageIsDisplayed(){
assert.strictEqual(await (await this.btnCancel).isDisplayed(), true)
assert.strictEqual(await (await this.btnFinish).isDisplayed(), true)
assert.strictEqual(await (await this.paymentInfoLabel).isDisplayed(), true)
assert.strictEqual(await (await this.shippingInfoLabel).isDisplayed(), true)
assert.strictEqual(await (await this.totalInfoLabel).isDisplayed(), true)
assert.strictEqual(await (await this.totalLabel).isDisplayed(), true)
assert.strictEqual(await (await this.subtotalLabel).isDisplayed(), true)
assert.strictEqual(await (await this.taxLabel).isDisplayed(), true)
}
}

module.exports = new OverviewPage();