const { browser } = require('@wdio/globals')
const assert = require('assert');
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
module.exports = class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    open (path) {
        if(path){
            return browser.url(`https://www.saucedemo.com/${path}`)
        }
        return browser.url(`https://www.saucedemo.com`)
    }
    generateRandomValue(type, min, max) {
        switch (type) {
            case 'number':
                return Math.floor(Math.random() * (max - min + 1)) + min;
            case 'string':
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                const length = Math.floor(Math.random() * (max - min + 1)) + min;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                return result;
            case 'boolean':
                return Math.random() < 0.5;
            default:
                throw new Error('Unsupported type');
        }
    }
    get btnCart() {
        return $("#shopping_cart_container");
      }
      get itemsInCartBadge(){
        return $('//a[contains(@class,"cart_link")]/span')
      }
      clickBtnCart() {
        this.btnCart.click();
      }
      get textHeading() {
        return $('//div[@class="app_logo"]');
      }
      get burgerMenu() {
        return $("#react-burger-menu-btn");
      }
      clickBurgerMenu(){
        this.burgerMenu.click()
      }
      get dropdown(){
        return $('//select[contains(@class,"sort_container")]')
      }
      clickDropdown(){
        this.dropdown.click()
      }
      get dropdownItems() {
        return $$('span.select_container .product_sort_container option')
      }
      sortByValue(value){
        if(value === "za" ||
            value === "az" ||
            value === "hilo" ||
            value === "lohi"
        ){
            this.dropdown.selectByAttribute("value", value)
        }
      }
    
      get Xbutton(){
        return $('#react-burger-cross-btn')
    }
    clickXButton(){
        this.Xbutton.click()
    }
    get allItems(){
        return $('//a[contains(@id,"inventory")]')
    }
    clickAllItems(){
        this.allItems.click()
    }
    get about(){
        return $('//a[contains(@id,"about")]')
    }
    clickAbout(){
        this.about.click()
    }
    get logout(){
        return $('//a[contains(@id,"logout")]')
    }
    clickLogout(){
        this.logout.click()
    }
    get resetAppState(){
        return $('//a[contains(@id,"reset")]')
    }
    clickResetAppState(){
        this.resetAppState.click()
    }
    get copyrightText(){
        return $('//div[contains(@data-test,"footer-copy")]')
    }
    get btnTwitter(){
        return $('//a[contains(@data-test,"twitter")]')
    }
    
    get btnFacebook(){
        return $('//a[contains(@data-test,"facebook")]')
    }
    get btnLinkedIn(){
        return $('//a[contains(@data-test,"linkedin")]')
    }
     clickTwitterBtn(){
         this.btnTwitter.click()
     }
     clickFacebookBtn(){
         this.btnFacebook.click()
     }
     clickLinkedInBtn(){
         this.btnLinkedIn.click()
     }
    async verifySideMenuIsOpen(){
       assert.strictEqual(await (await this.allItems).isDisplayed(), true)
       assert.strictEqual(await (await this.about).isDisplayed(), true)
       assert.strictEqual(await (await this.logout).isDisplayed(), true)
       assert.strictEqual(await (await this.resetAppState).isDisplayed(), true)
       assert.strictEqual(await (await this.Xbutton).isDisplayed(), true)
        }
    async checkSocialLinkIsOpenedInANewTabAndSwitchToSite(link){
        await browser.waitUntil(
            async () => {
                const windowHandles = await browser.getWindowHandles();
                if (windowHandles.length > 1) {
                    await browser.switchToWindow(windowHandles[1]); 
                    const newUrl = await browser.getUrl();
                    assert.strictEqual(newUrl, link);
                    await browser.closeWindow(); 
                    await browser.switchToWindow(windowHandles[0]); 
                    return true;
                }
                return false;
            },
            {
                timeout: 10000, 
                timeoutMsg: `The ${link} didn't open in a new tab within 10 seconds or the URL didn't match.`,
            }
        );
    }
    async verifySideMenuIsClosed(){
        assert.strictEqual(await (await this.logout).isClickable(), false)
        assert.strictEqual(await (await this.Xbutton).isClickable(), false)
        assert.strictEqual(await (await this.allItems).isClickable(), false)
        assert.strictEqual(await (await this.resetAppState).isClickable(), false)
        assert.strictEqual(await (await this.about).isClickable(), false)
        assert.strictEqual(await (await this.logout).isDisplayed(), false)
        assert.strictEqual(await (await this.Xbutton).isDisplayed(), false)
        assert.strictEqual(await (await this.allItems).isDisplayed(), false)
        assert.strictEqual(await (await this.resetAppState).isDisplayed(), false)
        assert.strictEqual(await (await this.about).isDisplayed(), false)
    }
}
