# Language: gherkin
Feature: Employee Management System - Login Page Automation

  Background:
    Given I open the Employee Management login page

  @run @adminLogin
  Scenario: Admin Login with valid credentials runs successfully
    When I select the "Admin Sign-in" tab
    And I enter the username as "admin"
    And I enter the password as "admin123"
    And I click the Sign In button
    Then I should be logged in successfully as admin

  @run @adminInvalidLogin
  Scenario: Admin Login with invalid credentials shows error
    When I select the "Admin Sign-in" tab
    And I enter the username as "wronguser"
    And I enter the password as "wrongpassword"
    And I click the Sign In button
    Then I should see an error message containing "Invalid admin credentials"
