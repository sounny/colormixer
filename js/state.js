// ==================
// STATE MANAGEMENT
// ==================

// State
let activeColors = [];
let mode = "RYB"; // 'RYB' = Paint, 'RGB' = Light
let isChallengeMode = false;
let isAccessibilityMode = false;
let isHighContrastMode = false;
let currentTarget = null; // { name: 'Purple', hex: '...' }
let tutorialStep = 0;
let currentTutorialTarget = null;
let currentResultColor = { hex: "#FFFFFF", text: "black" };

// ==================
// DOM ELEMENTS
// ==================

// DOM References (initialized after DOM loads)
const body = document.body;
const headerIcon = document.getElementById("header-icon");
const headerTitleText = document.getElementById("header-title-text");
const headerSubtitle = document.getElementById("header-subtitle");
const resultBlob = document.getElementById("result-blob");
const resultName = document.getElementById("result-name");
const equationText = document.getElementById("equation-text");
const examples = document.getElementById("examples");
const colorButtonsContainer = document.getElementById("color-buttons");
const footerText = document.getElementById("footer-text");
const footerMainText = document.getElementById("footer-main-text");
const keyboardHint = document.querySelector(".keyboard-hint");
const shineEffect = document.getElementById("shine-effect");
const hexDisplay = document.getElementById("hex-display");
const hexText = document.getElementById("hex-text");
const shareBtn = document.getElementById("share-btn");
const srAnnouncer = document.getElementById("sr-announcer");

// Challenge & Accessibility DOM
const challengeBtn = document.getElementById("challenge-toggle-btn");
const accessibilityBtn = document.getElementById("accessibility-toggle-btn");
const highContrastBtn = document.getElementById("high-contrast-toggle-btn");
const challengeBar = document.getElementById("challenge-bar");
const targetDot = document.getElementById("target-dot");
const targetName = document.getElementById("target-name");
const successOverlay = document.getElementById("success-overlay");
const successMessage = document.getElementById("success-message");

// Tutorial DOM
const tutorialBackdrop = document.getElementById("tutorial-backdrop");
const tutorialModal = document.getElementById("tutorial-modal");
const tutorialText = document.getElementById("tutorial-text");
const tutorialNext = document.getElementById("tutorial-next");
const tutorialSkip = document.getElementById("tutorial-skip");

// ==================
// ICONS & COLORS
// ==================

// Icon SVG paths
const paletteIconSVG = `
<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
<circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
<circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
<circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>
`;

const zapIconSVG = `
<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
`;

// Color definitions
const paintColors = {
  red: { name: "red", hex: "#FF4136", darkText: false },
  yellow: { name: "yellow", hex: "#FFDC00", darkText: true },
  blue: { name: "blue", hex: "#0074D9", darkText: false },
};

const lightColors = {
  red: { name: "red", hex: "#FF0000", darkText: false },
  green: { name: "green", hex: "#00FF00", darkText: true },
  blue: { name: "blue", hex: "#0000FF", darkText: false },
};

// Real-world examples for colors
const colorExamples = {
  Red: "apples, strawberries, roses",
  Blue: "sky, ocean, blueberries",
  Yellow: "sun, bananas, lemons",
  Green: "grass, leaves, emeralds",
  Purple: "eggplants, grapes, lavender",
  Orange: "pumpkins, carrots, oranges",
  Magenta: "hibiscus, flamingos",
  Cyan: "turquoise, peacocks",
  Brown: "chocolate, tree bark",
  White: "clouds, snow, milk",
  Black: "coal, space, ravens"
};

// Kid-friendly scientific explanations
const colorExplanations = {
  RYB: {
    Red: "Red is a primary color. You can't mix other paints to make it!",
    Blue: "Blue is a primary color. It's one of the main building blocks.",
    Yellow: "Yellow is a primary color. It's bright and sunny!",
    Purple: "Red and Blue paints soak up all colors except purple, which bounces back to your eyes!",
    Green: "Blue and Yellow paints mix to make Green. It's a secondary color.",
    Orange: "Red and Yellow paints mix to make Orange. It's a secondary color.",
    Brown: "Mixing everything makes Brown! The paints are absorbing almost all the light.",
    White: "White canvas means no paint is absorbing light yet."
  },
  RGB: {
    Red: "Red light adds energy to the dark screen.",
    Blue: "Blue light adds energy to the dark screen.",
    Green: "Green light adds energy to the dark screen.",
    Yellow: "Red and Green light mix to make Yellow. It's brighter than both!",
    Magenta: "Red and Blue light mix to make Magenta. It's a secondary light color.",
    Cyan: "Green and Blue light mix to make Cyan. It's a secondary light color.",
    White: "All the lights together make White! It's pure energy.",
    Black: "Black means the lights are off. It's total darkness."
  }
};

// Tutorial variables
const tutorialSteps = [
  { text: "Step 1: Click a color button to start mixing.", target: "#color-buttons" },
  { text: "Step 2: Try switching between Paint and Light modes.", target: "#mode-switcher", shape: "pill" },
  { text: "Step 3: Mix two colors to see the result!", target: "#result-blob", shape: "round" },
  { text: "Step 4: Copy the HEX code to your clipboard.", target: "#hex-display" },
  { text: "Tutorial complete! Enjoy mixing colors!" }
];
