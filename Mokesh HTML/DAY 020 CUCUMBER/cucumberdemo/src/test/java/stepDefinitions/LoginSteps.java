package stepDefinitions;

import io.cucumber.java.en.*;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import hooks.Hooks;

import java.time.Duration;

import static org.junit.Assert.*;

/**
 * Step Definitions for Employee Management Login Page
 * Automates the CR7 Sports Portal login scenarios
 */
public class LoginSteps {

    private WebDriver driver;
    private WebDriverWait wait;

    // ─── APP URL ───────────────────────────────────────────────────
    private static final String APP_URL = "http://localhost:5173";

    // ─── CSS Selectors ─────────────────────────────────────────────

    // Login card (visible before login)
    private static final By LOGIN_CARD         = By.cssSelector(".login-card");

    // Username input (id="username" in LoginPage.jsx)
    private static final By USERNAME_INPUT      = By.id("username");

    // Password input (id="password" in LoginPage.jsx)
    private static final By PASSWORD_INPUT      = By.id("password");

    // Sign In button (type="submit")
    private static final By SIGN_IN_BUTTON      = By.cssSelector("button[type='submit']");

    // Error alert div
    private static final By ERROR_ALERT         = By.cssSelector(".login-error-alert");

    // EmployeeDashboard root: div.app-container (from EmployeeDashboard.jsx line 319)
    private static final By APP_CONTAINER       = By.cssSelector(".app-container");

    // ─── STEPS ─────────────────────────────────────────────────────

    /**
     * Background step: Opens the login page.
     * Also clears localStorage so previous login sessions don't auto-redirect.
     */
    @Given("I open the Employee Management login page")
    public void i_open_the_employee_management_login_page() {
        driver = Hooks.getDriver();
        wait   = new WebDriverWait(driver, Duration.ofSeconds(15));

        System.out.println("📌 Navigating to: " + APP_URL);
        driver.get(APP_URL);

        // Clear localStorage to ensure we always start at the login page
        // (App.jsx checks localStorage 'portal_role' on mount)
        try {
            ((JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
            driver.navigate().refresh();
            System.out.println("   🧹 LocalStorage cleared — forcing fresh login page.");
        } catch (Exception e) {
            System.out.println("   ⚠️  Could not clear localStorage: " + e.getMessage());
        }

        // Wait for the login card to appear
        wait.until(ExpectedConditions.presenceOfElementLocated(LOGIN_CARD));
        System.out.println("✅ Login page loaded successfully.");
    }

    /**
     * Clicks on a role tab (Admin Sign-in / Employee Sign-in)
     */
    @When("I select the {string} tab")
    public void i_select_the_tab(String tabName) {
        System.out.println("🔘 Selecting tab: " + tabName);

        // Find the tab button by its visible text
        WebElement tab = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[normalize-space(text())='" + tabName + "']")
        ));
        tab.click();

        System.out.println("✅ Tab selected: " + tabName);
    }

    /**
     * Enters a value into the username field
     */
    @When("I enter the username as {string}")
    public void i_enter_the_username_as(String username) {
        System.out.println("✍️  Entering username: " + username);

        WebElement usernameField = wait.until(
            ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT)
        );
        usernameField.clear();
        usernameField.sendKeys(username);

        System.out.println("✅ Username entered: " + username);
    }

    /**
     * Enters a value into the password field
     */
    @When("I enter the password as {string}")
    public void i_enter_the_password_as(String password) {
        System.out.println("🔒 Entering password: [hidden]");

        WebElement passwordField = wait.until(
            ExpectedConditions.visibilityOfElementLocated(PASSWORD_INPUT)
        );
        passwordField.clear();
        passwordField.sendKeys(password);

        System.out.println("✅ Password entered.");
    }

    /**
     * Clicks the Sign In button
     */
    @When("I click the Sign In button")
    public void i_click_the_sign_in_button() {
        System.out.println("🖱️  Clicking Sign In button...");

        WebElement signInBtn = wait.until(
            ExpectedConditions.elementToBeClickable(SIGN_IN_BUTTON)
        );
        signInBtn.click();

        System.out.println("✅ Sign In button clicked.");
    }

    /**
     * Verifies successful admin login.
     *
     * How the app works (App.jsx):
     *   - On mount, reads localStorage 'portal_role'
     *   - If role is set → renders EmployeeDashboard (div.app-container)
     *   - Otherwise → renders LoginPage (div.login-container)
     *
     * LoginPage has an 800ms setTimeout before calling onLogin().
     * So we use a 20s wait for .app-container to appear.
     */
    @Then("I should be logged in successfully as admin")
    public void i_should_be_logged_in_successfully_as_admin() {
        System.out.println("🔍 Verifying successful admin login (waiting up to 20s)...");

        // Longer wait to handle the 800ms setTimeout in LoginPage + React render
        WebDriverWait longWait = new WebDriverWait(driver, Duration.ofSeconds(20));

        try {
            // Wait for EmployeeDashboard root element to appear in the DOM
            longWait.until(ExpectedConditions.presenceOfElementLocated(APP_CONTAINER));
            System.out.println("   ✅ .app-container detected — Dashboard loaded!");
        } catch (TimeoutException e) {
            // Print current page source excerpt for debugging
            String bodyText = driver.findElement(By.tagName("body")).getText();
            System.out.println("   ❌ Timeout! Current page text (first 300 chars): "
                + bodyText.substring(0, Math.min(300, bodyText.length())));
            fail("❌ Admin login FAILED — EmployeeDashboard (.app-container) did not appear within 20 seconds.");
        }

        // Extra confirmation: login card should no longer be present
        boolean loginCardGone = driver.findElements(LOGIN_CARD).isEmpty();
        System.out.println("   Login card gone: " + loginCardGone);

        assertTrue(
            "❌ Admin login FAILED — Dashboard appeared but login card is still visible!",
            loginCardGone
        );

        System.out.println("✅ PASS: Admin logged in successfully — Dashboard is visible!");
    }

    /**
     * Verifies that an error message is shown with the expected text
     */
    @Then("I should see an error message containing {string}")
    public void i_should_see_an_error_message_containing(String expectedMessage) {
        System.out.println("🔍 Verifying error message contains: '" + expectedMessage + "'");

        WebElement errorAlert = wait.until(
            ExpectedConditions.visibilityOfElementLocated(ERROR_ALERT)
        );

        String actualMessage = errorAlert.getText().trim();
        System.out.println("📢 Actual error displayed: '" + actualMessage + "'");

        assertTrue(
            "❌ Expected error to contain: [" + expectedMessage + "] but got: [" + actualMessage + "]",
            actualMessage.contains(expectedMessage)
        );

        System.out.println("✅ PASS: Error message verified — '" + actualMessage + "'");
    }
}
