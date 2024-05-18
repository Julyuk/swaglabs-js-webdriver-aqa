const { browser } = require('@wdio/globals')

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
}
