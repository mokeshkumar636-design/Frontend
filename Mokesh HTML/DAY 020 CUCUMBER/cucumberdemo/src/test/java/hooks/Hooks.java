package hooks;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

/**
 * Cucumber Hooks - Manages WebDriver lifecycle for each scenario.
 * Opens Chrome before each scenario and tears it down after.
 */
public class Hooks {

    private static WebDriver driver;

    /**
     * Returns the current WebDriver instance (shared via static ref).
     */
    public static WebDriver getDriver() {
        return driver;
    }

    /**
     * Runs BEFORE each scenario.
     * Sets up ChromeDriver automatically via WebDriverManager.
     */
    @Before(order = 1)
    public void setUp(Scenario scenario) {
        System.out.println("\n========================================================");
        System.out.println("🚀 STARTING SCENARIO: " + scenario.getName());
        System.out.println("   Tags: " + scenario.getSourceTagNames());
        System.out.println("========================================================");

        // Auto-download and setup ChromeDriver
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        // Run in non-headless mode so you can SEE the automation
        // To run headless (no browser window), uncomment below:
        // options.addArguments("--headless");
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");

        driver = new ChromeDriver(options);
        System.out.println("✅ Chrome browser launched for scenario: " + scenario.getName());
    }

    /**
     * Runs AFTER each scenario.
     * Takes screenshot if test fails, then closes the browser.
     */
    @After(order = 1)
    public void tearDown(Scenario scenario) {
        System.out.println("\n--------------------------------------------------------");

        if (scenario.isFailed()) {
            System.out.println("❌ SCENARIO FAILED: " + scenario.getName());
            // Attach screenshot to Cucumber report on failure
            try {
                byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
                scenario.attach(screenshot, "image/png", "Screenshot on Failure");
                System.out.println("📸 Screenshot captured and attached to report.");
            } catch (Exception e) {
                System.out.println("⚠️  Could not capture screenshot: " + e.getMessage());
            }
        } else {
            System.out.println("✅ SCENARIO PASSED: " + scenario.getName());
        }

        if (driver != null) {
            driver.quit();
            driver = null;
            System.out.println("🔒 Browser closed.");
        }

        System.out.println("========================================================\n");
    }
}
