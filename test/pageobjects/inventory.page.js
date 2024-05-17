const { $ } = require('@wdio/globals')
const Page = require('./page');


class InventoryPage extends Page {
    get btnCart(){
        return $('#shopping_cart_container')
     }
 clickBtnCart(){
    this.btnCart.click()
   }
  get textHeading(){
  return $('//div[@class="app_logo"]')
    }
get burgerMenu(){
     return $('#react-burger-menu-btn')
   }

    open () {
        return super.open('inventory.html');
    }


    get items(){
        return $$(`//div[@data-test="inventory-item"]`)
    }
    getItemById(id){
        return $(`(//div[@data-test="inventory-item"])[${id+1}]`)
    }
    getItemImageById(id){
        return $(`(//div[@class="inventory_item_img"])[${id+1}]`)
    }
    getItemPriceById(id){
        return $(`(//div[@class="inventory_item_price"])[${id+1}]`)
    }
    getItemBtnById(id){
        return $(`(//button[contains(@name,"add-to-cart")])[${id+1}]`)
    }
    getItemNameById(id){
        return $(`(//div[contains(@class,"item_name")])[${id+1}]`)
    }
    getItemDescById(id){
        return $(`(//div[@class="inventory_item_desc"])[${id+1}]`)
    }

    get productsText(){}

    get dropdown(){}
    get dropdownActiveOption(){}
    clickDropdownOptionById(id){}
}

module.exports = new InventoryPage();
