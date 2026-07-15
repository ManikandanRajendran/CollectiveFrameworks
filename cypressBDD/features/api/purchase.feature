Feature: API purchase

Scenario: Verify successful purchase
    Given I login via API with username "demo" and password "Demo@123"
    And the API login should be successful for user "demo"
    And I add item to cart via API
    And I validate the cart item via API
    When I checkout and pay via API
    Then verify the order confirmation via API

Scenario: Verify able to remove cart item
    Given I login via API with username "demo" and password "Demo@123"
    And the API login should be successful for user "demo"
    And I add item to cart via API
    When I remove the cart item via API
    Then the api should return "Item removed from cart" message
