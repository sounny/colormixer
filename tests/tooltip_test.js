const fs = require('fs');
const path = require('path');

// Test Suite
console.log("Running Tooltip Logic Tests (Dependency-Free)...");

try {
    const htmlPath = path.join(__dirname, '../index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Test 1: Verify Tooltip Structure is MISSING (Red Phase)
    // We want to ensure we are starting from a clean slate.
    // The feature requires an element with id="edu-tooltip"
    const hasTooltip = html.includes('id="edu-tooltip"');
    
    if (!hasTooltip) {
        console.log("✅ [Red Phase] Tooltip container (id='edu-tooltip') is correctly missing.");
    } else {
        console.error("❌ [Red Phase] Tooltip container already exists!");
        process.exit(1);
    }

    // Test 2: Verify Toggle Button is MISSING (Red Phase)
    const hasToggle = html.includes('id="tooltip-toggle"');
    if (!hasToggle) {
        console.log("✅ [Red Phase] Tooltip toggle button is correctly missing.");
    } else {
        console.error("❌ [Red Phase] Tooltip toggle button already exists!");
        process.exit(1);
    }

    console.log("\nAll Red Phase checks passed. Ready to implement features.");
    process.exit(0);

} catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
}