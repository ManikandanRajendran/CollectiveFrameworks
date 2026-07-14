Feature: API Login

Scenario: Verify successful login with valid credentials
    When I login via API with username "demo" and password "Demo@123"
    Then the API login should be successful for user "demo"

Scenario: Verify login fails with invalid credentials
    When I login via API with username "demo" and password "wrongpassword"
    Then the API login should fail with status 401 and message "Invalid username or password"
