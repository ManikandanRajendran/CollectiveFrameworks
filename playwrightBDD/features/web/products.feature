Feature: Verify products page filtering

  Background:
    Given user is logged in as "testuser" with password "Test@123"

  Scenario: Verify user can filter products by category Electronics
    Given user is on the products page
    When user filters by category "Electronics"
    Then user should see product "Mechanical Keyboard"
    And user should see product "Bluetooth Speaker"
    And user should not see product "Backpack"

  Scenario: Verify user can search for a product by name
    Given user is on the products page
    When user searches for "Keyboard"
    Then user should see product "Mechanical Keyboard"
