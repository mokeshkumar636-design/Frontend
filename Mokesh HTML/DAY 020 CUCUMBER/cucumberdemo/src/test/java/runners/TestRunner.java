package runners;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

/**
 * JUnit Test Runner for Cucumber BDD Tests
 *
 * Runs ONLY scenarios tagged with @run — exactly 2 test scenarios:
 *   1. Admin Login with valid credentials
 *   2. Admin Login with invalid credentials
 *
 * Reports are generated in:
 *   - target/cucumber-reports/cucumber.json  (JSON)
 *   - target/cucumber-reports/report.html    (HTML)
 */
@RunWith(Cucumber.class)
@CucumberOptions(
    // Path to feature files
    features = "src/test/resources/features",

    // Package(s) containing step definitions and hooks
    glue = {"stepDefinitions", "hooks"},

    // Run ONLY scenarios tagged @run  ← This enforces exactly 2 runs
    tags = "@run",

    // Output plugins / reporters
    plugin = {
        "pretty",                                          // Colourful console output
        "html:target/cucumber-reports/report.html",        // HTML report
        "json:target/cucumber-reports/cucumber.json",      // JSON report
        "junit:target/cucumber-reports/cucumber.xml"       // JUnit XML report
    },

    // Show monochrome output (no colour codes in CI logs)
    monochrome = true,

    // Publish dry run = false (run for real)
    dryRun = false
)
public class TestRunner {
    // JUnit will pick this up and run all @run-tagged Cucumber scenarios
}
