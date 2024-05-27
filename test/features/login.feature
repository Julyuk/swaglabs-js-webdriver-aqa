Feature: Login

  Scenario: Display error message for empty fields
    Given User is located on the main page of the saucedemo website
    When User clicks the "Login" button
    Then User should see the "Epic sadface: Username is required" error message
