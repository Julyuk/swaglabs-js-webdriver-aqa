const { $ } = require('@wdio/globals')
const Page = require('./page');
const assert = require('assert');

class LoginPage extends Page {
    get loginHeading(){
        return $('.login_logo')
    }

    get inputUsername () {
        return $('input[data-test="username"]');
    }

    get inputPassword () {
        return $('input[data-test="password"]');
    }

    get btnLogin () {
        return $('#login-button');
    }

    get acceptedUsernamesHeading(){
        return $('#login_credentials h4');
    }

    get allAcceptedUsernames(){
        return $('//div[@id="login_credentials"]');
    }

    get passwordForAllHeading(){
        return $('//div[contains(@class,"login_password")]/h4')
    }
    get passwordForAll() {
        return $('//div[contains(@class,"login_password")]');
    }

    get errorMsg(){
        return $('//h3[@data-test="error"]')
    }

    get errorIcons(){
        return $$('svg.error_icon')
    }

    async getPasswordForAll(){
        const passwordElement = await this.passwordForAll;
        const passwordText = await passwordElement.getText();
        const headingText = await this.passwordForAllHeading.getText();
        return passwordText.replace(headingText, '').trim();
    }
    
    async getAcceptedUsernameById(id) {
        const text = await this.allAcceptedUsernames.getText();
        const headingText = await this.acceptedUsernamesHeading.getText();
        const lines = text.replace(headingText, '').trim().split('\n');
        if(id>=0 && id<=lines.length){
            return lines[id].trim();
        }
    }
    async login (username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        const usernameValue = await this.inputUsername.getAttribute("value");
        const passwordValue = await this.inputPassword.getAttribute("value");
        const passwordType = await this.inputPassword.getAttribute("type");

        assert.strictEqual(usernameValue, username);
        assert.strictEqual(passwordValue, password);
        assert.strictEqual(passwordType, "password");
        await this.btnLogin.click();
    }
    async assertInvalidLogin(){
        const errorMsg = "Epic sadface: Username and password do not match any user in this service"
        const actualErrorMsg = await (await this.errorMsg).getText();
        assert.strictEqual(actualErrorMsg, errorMsg);
        const errorIcons = await this.errorIcons;
        assert.strictEqual(errorIcons.length, 2);
        for (const icon of errorIcons) {
        const isDisplayed = await icon.isDisplayed();
        const iconColor = await (await icon.getCSSProperty('color')).value;
        assert.strictEqual(isDisplayed, true);
        assert.strictEqual(iconColor, "rgba(226,35,26,1)");
         }
        assert.strictEqual(await (await this.errorMsg).isDisplayed(), true)
        assert.strictEqual((await (await this.inputUsername).getCSSProperty("border-bottom-color")).value, "rgba(226,35,26,1)")
        assert.strictEqual((await (await this.inputPassword).getCSSProperty("border-bottom-color")).value, "rgba(226,35,26,1)") 
    }
}

module.exports = new LoginPage();
