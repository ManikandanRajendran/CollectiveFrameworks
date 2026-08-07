Feature: verify purchase functionality

@only
Scenario Outline: Verify user is able to purchase a product
    Given user is logged in as "<username>" with password "<password>" and on the homepage
    And user search a "<product>"
    And user clicks add to cart
    And user goto cart and click proceed to checkout
    And user clicks continue to payment
    And user enter card details and click review order
    When user clicks place order & pay
    Then user should see the order confirmation page
Examples:
| username | password | product           |
| demo     | Demo@123 | Bluetooth Speaker |