
const fs = require('fs');
const path = require('path');

// Test Suite
console.log("Running Tooltip Logic Tests (Green Phase - Verification)...");

try {
    const htmlPath = path.join(__dirname, '../index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Test 1: Verify Tooltip Container Exists
    const hasTooltip = html.includes('id="edu-tooltip"');
    
    if (hasTooltip) {
        console.log("✅ [Green Phase] Tooltip container (id='edu-tooltip') is present.");
    } else {
        console.error("❌ [Green Phase] Tooltip container is MISSING!");
        process.exit(1);
    }

    // Test 2: Verify Toggle Button Exists
    const hasToggle = html.includes('id="tooltip-toggle"');
    if (hasToggle) {
        console.log("✅ [Green Phase] Tooltip toggle button is present.");
    } else {
        console.error("❌ [Green Phase] Tooltip toggle button is MISSING!");
        process.exit(1);
    }

    // Test 3: Verify Data Logic (Static Check)
    // We check if the script contains the mapped explanations for Purple (Paint) and Yellow (Light)
    const hasPurpleExplanation = html.includes("Red and Blue paints soak up all colors except purple");
    const hasYellowExplanation = html.includes("Red and Green light mix to make Yellow");

    if (hasPurpleExplanation && hasYellowExplanation) {
        console.log("✅ [Green Phase] Scientific explanations are correctly embedded in the script.");
    } else {
        console.error("❌ [Green Phase] Missing specific color explanations in the script source.");
        process.exit(1);
    }

    console.log("\nAll Green Phase checks passed. Feature verified.");
    process.exit(0);

} catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
}
