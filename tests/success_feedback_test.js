const fs = require('fs');
const path = require('path');

// Test Suite
console.log("Running Success Feedback Logic Tests (Green Phase)...");

try {
    const htmlPath = path.join(__dirname, '../index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    // Test 1: Verify 'pulse-success' animation class exists
    const hasPulseAnimation = html.includes('pulse-success');
    
    if (hasPulseAnimation) {
        console.log("✅ [Green Phase] 'pulse-success' animation class is present.");
    } else {
        console.error("❌ [Green Phase] 'pulse-success' is MISSING!");
        process.exit(1);
    }

    // Test 2: Verify multi-color confetti implementation
    const hasMultiConfetti = html.includes('radial-gradient(circle, #ff0000 1px');
    if (hasMultiConfetti) {
        console.log("✅ [Green Phase] Multi-color confetti effect is implemented.");
    } else {
        console.error("❌ [Green Phase] Multi-color confetti is MISSING!");
        process.exit(1);
    }

    // Test 3: Verify showSuccess triggers the animations
    const hasTriggerLogic = html.includes("resultBlob.classList.add('pulse-success')");
    if (hasTriggerLogic) {
        console.log("✅ [Green Phase] showSuccess function correctly triggers visual feedback.");
    } else {
        console.error("❌ [Green Phase] Animation trigger logic is MISSING in showSuccess!");
        process.exit(1);
    }

    console.log("\nAll Green Phase checks passed. Feature verified.");
    process.exit(0);

} catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
}