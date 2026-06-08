Feature: Verify login functionality

Scenario: Verify user is able to login with valid credentials
    Given user is in login page
    And User enter the username as "testuser" and password as "Test@123"
    When user click login button
    Then user should be logged in
    And user should see the homepage

Scenario: Verify user is able to login and logout with valid credentials
    Given user is in login page
    And User enter the username as "testuser" and password as "Test@123"
    When user click login button
    And user should be logged in
    And user clicks logout button
    Then user should be logged out

Scenario Outline: Verify user cannot login with invalid credentials
    Given user is in login page
    And User enter the username as "<username>" and password as "<password>"
    When user click login button
    Then user should see login "<errorMessage>"
    Examples:
    | username  | password       | errorMessage                    |
    | testuser  | wrongpassword  | Invalid username or password    |

Scenario Outline: Verify the error message when username/password is empty
    Given user is in login page
    And User enter the username as "<username>" and password as "<password>"
    When user click login button
    Then the "<field>" field should show validation

    Examples:
    | username  | password       | field    |
    | demo      |                | password |
    |           | Test@123       | username |
