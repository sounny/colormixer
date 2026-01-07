// ==================
// COLOR MIXING LOOKUP TABLE
// ==================
// This replaces ~150 lines of if/else logic with a data-driven approach.
// Add this after the colorExplanations object (around line 1447).

const mixingTable = {
  RYB: {
    // Empty state (no colors selected)
    "": {
      name: "White",
      hex: "#FFFFFF",
      text: "black",
      glow: false,
      equation: "Pick a color to start",
    },
    // Single colors
    red: {
      name: "Red",
      hex: "#FF4136",
      text: "white",
      glow: false,
      equation: "Selected Red.",
    },
    blue: {
      name: "Blue",
      hex: "#0074D9",
      text: "white",
      glow: false,
      equation: "Selected Blue.",
    },
    yellow: {
      name: "Yellow",
      hex: "#FFDC00",
      text: "black",
      glow: false,
      equation: "Selected Yellow.",
    },
    // Two-color mixes (keys are sorted alphabetically)
    "blue,red": {
      name: "Purple",
      hex: "#B10DC9",
      text: "white",
      glow: false,
      equation: "Mixed Red and Blue. Result is Purple.",
    },
    "blue,yellow": {
      name: "Green",
      hex: "#2ECC40",
      text: "white",
      glow: false,
      equation: "Mixed Blue and Yellow. Result is Green.",
    },
    "red,yellow": {
      name: "Orange",
      hex: "#FF851B",
      text: "black",
      glow: false,
      equation: "Mixed Red and Yellow. Result is Orange.",
    },
    // Three-color mix
    "blue,red,yellow": {
      name: "Brown",
      hex: "#5b3c11",
      text: "white",
      glow: false,
      equation: "Mixed Red, Yellow, and Blue. Result is Brown.",
    },
  },
  RGB: {
    // Empty state (no lights on)
    "": {
      name: "Black",
      hex: "#000000",
      text: "white",
      glow: false,
      equation: "Pick a color to start",
    },
    // Single colors
    red: {
      name: "Red",
      hex: "#FF0000",
      text: "white",
      glow: true,
      equation: "Selected Red Light.",
    },
    blue: {
      name: "Blue",
      hex: "#0000FF",
      text: "white",
      glow: true,
      equation: "Selected Blue Light.",
    },
    green: {
      name: "Green",
      hex: "#00FF00",
      text: "black",
      glow: true,
      equation: "Selected Green Light.",
    },
    // Two-color mixes (keys are sorted alphabetically)
    "green,red": {
      name: "Yellow",
      hex: "#FFFF00",
      text: "black",
      glow: true,
      equation: "Mixed Red and Green. Result is Yellow.",
    },
    "blue,red": {
      name: "Magenta",
      hex: "#FF00FF",
      text: "white",
      glow: true,
      equation: "Mixed Red and Blue. Result is Magenta.",
    },
    "blue,green": {
      name: "Cyan",
      hex: "#00FFFF",
      text: "black",
      glow: true,
      equation: "Mixed Green and Blue. Result is Cyan.",
    },
    // Three-color mix
    "blue,green,red": {
      name: "White",
      hex: "#FFFFFF",
      text: "black",
      glow: true,
      equation: "Mixed Red, Green, and Blue. Result is White.",
    },
  },
};

// ==================
// REFACTORED updateResult() FUNCTION
// ==================
// Replace the existing updateResult() function (lines 1850-2008) with this:

function updateResult() {
  const current = [...activeColors].sort();
  const key = current.join(",");

  // Look up the result from the mixing table
  const lookup = mixingTable[mode][key];

  // Default fallback (should not happen with valid inputs)
  const defaultResult =
    mode === "RYB"
      ? {
          name: "White",
          hex: "#FFFFFF",
          text: "black",
          glow: false,
          equation: "Pick a color to start",
        }
      : {
          name: "Black",
          hex: "#000000",
          text: "white",
          glow: false,
          equation: "Pick a color to start",
        };

  const result = lookup || defaultResult;
  const equation = result.equation;

  // Apply result to DOM
  resultBlob.style.backgroundColor = result.hex;
  resultName.textContent = result.name;
  resultName.style.color = result.text;
  equationText.textContent = equation;

  // Update examples
  examples.textContent = `Examples: ${
    colorExamples[result.name] || "various objects"
  }`;

  // Update tooltip content
  updateTooltip(result.name);

  // Apply Accessibility Patterns to Result Blob
  let existingOverlays = resultBlob.querySelectorAll(".pattern-overlay");
  existingOverlays.forEach((el) => el.remove());

  if (isAccessibilityMode) {
    activeColors.forEach((color) => {
      const overlay = document.createElement("div");
      overlay.className = `pattern-overlay pattern-${color}`;
      overlay.style.opacity = activeColors.length > 1 ? "0.15" : "0.25";
      resultBlob.appendChild(overlay);
    });
  }

  // Update HEX display
  currentResultColor = result;
  hexText.textContent = result.hex;
  hexDisplay.style.color = result.text;

  // Glow effect for light mode
  if (result.glow) {
    resultBlob.style.boxShadow = `0 0 60px ${result.hex}`;
  } else if (mode === "RGB") {
    resultBlob.style.boxShadow = "0 0 50px rgba(255, 255, 255, 0.2)";
  } else {
    resultBlob.style.boxShadow = "inset 0 2px 10px rgba(0, 0, 0, 0.1)";
  }

  // Confetti for successful mixes
  if (current.length > 1) {
    resultBlob.classList.add("confetti");
    setTimeout(() => resultBlob.classList.remove("confetti"), 1000);
  }

  // Screen Reader Announcement
  let announcement = "";
  if (current.length === 0) {
    announcement = `No colors selected. Canvas is ${result.name}.`;
  } else {
    const joinedColors = current
      .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
      .join(" and ");
    announcement = `Mixed ${joinedColors}. Result is ${result.name}.`;
  }
  srAnnouncer.textContent = announcement;

  // Check for challenge mode win
  checkChallengeWin(result.name);
}

// ==================
// INSTRUCTIONS
// ==================
//
// 1. Add the `mixingTable` object after `colorExplanations` (around line 1447)
//
// 2. Replace the entire `updateResult()` function (lines 1850-2065) with the
//    refactored version above
//
// This reduces ~160 lines of if/else to ~60 lines of clean, data-driven code.
//
// Note: The refactored function assumes a `checkChallengeWin()` function exists.
// If it doesn't, remove that line or add the check.
