Feature: Verify user purchase functionality

@integration
Scenario Outline: Verify user can purchase a product
    Given user is logged in via API with username "testuser" and password "Test@123"
    And user visits the products page
    And user searching a "<product>"
    And user clicks add to cart
    And user navigates to cart
    And user clicks proceed to checkout
    And user clicks continue to payment
    And user enter payment details
    Then user should see the order confirmation page

    Examples:
    | product     |
    | Smart Watch |

@mock
Scenario: Verify user can purchase a product using mock
    Given all purchase APIs are mocked
    And user is logged in via API with username "testuser" and password "Test@123"
    And user visits the products page
    And user clicks add to cart
    And user navigates to cart
    And user clicks proceed to checkout
    And user clicks continue to payment
    And user enter payment details
    Then user should see the order confirmation page
