Feature: API Login

  Scenario: Login via API with valid credentials
    When I login via API with username "demo" and password "Demo@123"
    Then the API login should succeed for user "demo"