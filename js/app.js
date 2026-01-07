// ==================
// CHALLENGE MODE LOGIC
// ==================

function toggleChallengeMode() {
  isChallengeMode = !isChallengeMode;
  
  if (isChallengeMode) {
    challengeBtn.classList.add('active');
    challengeBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
         <line x1="18" y1="6" x2="6" y2="18"></line>
         <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span>Exit Game</span>
    `;
    challengeBar.classList.add('active');
    startChallenge();
  } else {
    challengeBtn.classList.remove('active');
    challengeBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
      </svg>
      <span>Game Mode</span>
    `;
    challengeBar.classList.remove('active');
    currentTarget = null;
    reset();
  }
}

function toggleAccessibilityMode() {
  isAccessibilityMode = !isAccessibilityMode;
  localStorage.setItem("accessibilityMode", isAccessibilityMode);
  
  if (isAccessibilityMode) {
    body.classList.add('accessibility-mode');
    accessibilityBtn.classList.add('active');
    accessibilityBtn.setAttribute('aria-pressed', 'true');
  } else {
    body.classList.remove('accessibility-mode');
    accessibilityBtn.classList.remove('active');
    accessibilityBtn.setAttribute('aria-pressed', 'false');
  }
  
  renderColorButtons();
  updateResult();
}

function toggleHighContrastMode() {
  isHighContrastMode = !isHighContrastMode;
  localStorage.setItem("highContrastMode", isHighContrastMode);
  
  if (isHighContrastMode) {
    body.classList.add('high-contrast-mode');
    highContrastBtn.classList.add('active');
    highContrastBtn.setAttribute('aria-pressed', 'true');
  } else {
    body.classList.remove('high-contrast-mode');
    highContrastBtn.classList.remove('active');
    highContrastBtn.setAttribute('aria-pressed', 'false');
  }
}

function startChallenge() {
  // Define possible targets based on mode
  let targets = [];
  if (mode === "RYB") {
    targets = [
      { name: "Purple", hex: "#B10DC9" },
      { name: "Green", hex: "#2ECC40" },
      { name: "Orange", hex: "#FF851B" },
      { name: "Brown", hex: "#5b3c11" }
    ];
  } else {
    targets = [
      { name: "Yellow", hex: "#FFFF00" },
      { name: "Magenta", hex: "#FF00FF" },
      { name: "Cyan", hex: "#00FFFF" },
      { name: "White", hex: "#FFFFFF" }
    ];
  }

  // Pick random target (different from previous if possible)
  let newTarget;
  do {
    newTarget = targets[Math.floor(Math.random() * targets.length)];
  } while (currentTarget && newTarget.name === currentTarget.name && targets.length > 1);

  currentTarget = newTarget;
  
  // Update UI
  targetName.textContent = currentTarget.name;
  targetDot.style.backgroundColor = currentTarget.hex;
  
  // Reset canvas for new level
  reset();
}

function checkChallenge(currentResultName) {
  if (!isChallengeMode || !currentTarget) return;

  if (currentResultName === currentTarget.name) {
    // Success!
    setTimeout(() => {
       showSuccess();
    }, 300); // Slight delay for visual confirmation
  }
}

function showSuccess() {
  successMessage.textContent = `You made ${currentTarget.name}!`;
  successOverlay.classList.add('active');
  
  // Trigger visual fanfare
  resultBlob.classList.add('pulse-success');
  resultBlob.classList.add('confetti');
  
  // Remove fanfare after some time
  setTimeout(() => {
    resultBlob.classList.remove('pulse-success');
    resultBlob.classList.remove('confetti');
  }, 3000);
}

function nextChallenge() {
  successOverlay.classList.remove('active');
  startChallenge();
}

function skipChallenge() {
  // Briefly shake the bar or just move next
  startChallenge();
}

// Initialize
function init() {
  // ==================
  // EMBED MODE: Parse URL params
  // ==================

  const urlParams = new URLSearchParams(window.location.search);
  const embedMode = urlParams.get('mode');
  if (embedMode === 'RYB' || embedMode === 'RGB') {
    mode = embedMode;
  } else {
    // Load saved mode if available
    const savedMode = localStorage.getItem("colorMixerMode");
    if (savedMode && (savedMode === "RYB" || savedMode === "RGB")) {
      mode = savedMode;
    }
  }

  const embedColors = urlParams.get('colors');
  if (embedColors) {
    const colorsArray = embedColors.split(',').map(c => c.trim().toLowerCase());
    activeColors = colorsArray.filter(c => ['red', 'yellow', 'blue', 'green'].includes(c));
  }

  // Apply mode and render
  if (mode === "RYB") {
    body.classList.remove("light-mode");
    body.classList.add("paint-mode");
    headerIcon.innerHTML = paletteIconSVG;
    headerTitleText.textContent = "Paint Mixer";
    headerSubtitle.textContent = "Mixing paint gets darker!";
    footerMainText.textContent = "Red + Yellow + Blue = Brown Paint";
    keyboardHint.textContent = "Keyboard: R Y B colors · Space reset · Tab mode";
    shineEffect.style.opacity = "0.3";
  } else {
    body.classList.remove("paint-mode");
    body.classList.add("light-mode");
    headerIcon.innerHTML = zapIconSVG;
    headerTitleText.textContent = "Light Mixer";
    headerSubtitle.textContent = "Mixing light gets brighter!";
    footerMainText.textContent = "Red + Green + Blue = White Light";
    keyboardHint.textContent = "Keyboard: R G B colors · Space reset · Tab mode";
    shineEffect.style.opacity = "0";
  }

  renderColorButtons();
  updateResult();

  // Load saved accessibility preference
  const savedAccessibility = localStorage.getItem("accessibilityMode");
  if (savedAccessibility === "true") {
    isAccessibilityMode = true;
    body.classList.add('accessibility-mode');
    accessibilityBtn.classList.add('active');
    accessibilityBtn.setAttribute('aria-pressed', 'true');
    renderColorButtons();
    updateResult();
  }

  // Load saved high contrast preference
  const savedHighContrast = localStorage.getItem("highContrastMode");
  if (savedHighContrast === "true") {
    isHighContrastMode = true;
    body.classList.add('high-contrast-mode');
    highContrastBtn.classList.add('active');
    highContrastBtn.setAttribute('aria-pressed', 'true');
  }

  // Show tutorial if not shown before
  if (!localStorage.getItem('tutorialShown')) {
    setTimeout(showTutorial, 500); // Delay to let page load
  }

  // Tutorial event listeners
  tutorialNext.addEventListener('click', nextTutorial);
  tutorialSkip.addEventListener('click', skipTutorial);
  tutorialBackdrop.addEventListener('click', skipTutorial);
}

// Render color buttons based on mode
function renderColorButtons() {
  const colors = mode === "RYB" ? paintColors : lightColors;
  const colorOrder =
    mode === "RYB" ? ["red", "yellow", "blue"] : ["red", "green", "blue"];

  colorButtonsContainer.innerHTML = colorOrder
    .map((colorKey) => {
      const color = colors[colorKey];
      const isActive = activeColors.includes(color.name);
      const activeClass = isActive ? "active" : "";
      const textClass = color.darkText ? "dark-text" : "light-text";
      const indicatorClass = color.darkText ? "dark" : "light";

      let glowStyle = "";
      if (mode === "RGB" && isActive) {
        glowStyle = `box-shadow: 0 0 0 4px #0f172a, 0 0 0 6px white, 0 0 20px ${color.hex};`;
      }

      return `
    <button 
      class="color-btn ${activeClass}" 
      style="background-color: ${color.hex}; ${glowStyle} position: relative; overflow: hidden;"
      onclick="toggleColor('${color.name}')"
      aria-label="Add ${color.name}"
    >
      <div class="pattern-overlay pattern-${color.name}"></div>
      <span class="color-btn-label ${textClass}">${color.name}</span>
      <div class="active-indicator ${indicatorClass}"></div>
    </button>
  `;
    })
    .join("");
}

// Toggle color selection
function toggleColor(colorName) {
  if (activeColors.includes(colorName)) {
    activeColors = activeColors.filter((c) => c !== colorName);
  } else {
    activeColors.push(colorName);
  }
  renderColorButtons();
  updateResult();
}

// Reset all colors
function reset() {
  activeColors = [];
  renderColorButtons();
  updateResult();
}

// Switch between Paint and Light mode
function switchMode(newMode, shouldSave = true) {
  mode = newMode;
  activeColors = []; // Clear to avoid confusion

  if (shouldSave) {
    localStorage.setItem("colorMixerMode", mode);
  }

  if (mode === "RYB") {
    body.classList.remove("light-mode");
    body.classList.add("paint-mode");
    headerIcon.innerHTML = paletteIconSVG;
    headerTitleText.textContent = "Paint Mixer";
    headerSubtitle.textContent = "Mixing paint gets darker!";
    footerMainText.textContent = "Red + Yellow + Blue = Brown Paint";
    keyboardHint.textContent = "Keyboard: R Y B colors · Space reset · Tab mode";
    shineEffect.style.opacity = "0.3";
  } else {
    body.classList.remove("paint-mode");
    body.classList.add("light-mode");
    headerIcon.innerHTML = zapIconSVG;
    headerTitleText.textContent = "Light Mixer";
    headerSubtitle.textContent = "Mixing light gets brighter!";
    footerMainText.textContent = "Red + Green + Blue = White Light";
    keyboardHint.textContent = "Keyboard: R G B colors · Space reset · Tab mode";
    shineEffect.style.opacity = "0";
  }

  body.classList.toggle("accessibility-mode", isAccessibilityMode);

  renderColorButtons();
  updateResult();
}

// ==================
// TUTORIAL LOGIC
// ==================

function clearTutorialHighlight() {
  if (!currentTutorialTarget) return;
  currentTutorialTarget.classList.remove("tutorial-highlight", "tutorial-pill", "tutorial-round");
  currentTutorialTarget = null;
}

function applyTutorialStep() {
  const step = tutorialSteps[tutorialStep];
  tutorialText.textContent = step.text;
  tutorialNext.textContent = tutorialStep === tutorialSteps.length - 1 ? "Finish" : "Next";
  clearTutorialHighlight();

  if (step.target) {
    const targetEl = document.querySelector(step.target);
    if (targetEl) {
      targetEl.classList.add("tutorial-highlight");
      if (step.shape === "pill") targetEl.classList.add("tutorial-pill");
      if (step.shape === "round") targetEl.classList.add("tutorial-round");
      currentTutorialTarget = targetEl;
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

function showTutorial() {
  tutorialStep = 0;
  tutorialBackdrop.style.display = "block";
  tutorialModal.style.display = "flex";
  applyTutorialStep();
  tutorialNext.focus();
}

function nextTutorial() {
  tutorialStep++;
  if (tutorialStep < tutorialSteps.length) {
    applyTutorialStep();
    return;
  }
  hideTutorial();
}

function skipTutorial() {
  hideTutorial();
}

function hideTutorial() {
  tutorialModal.style.display = "none";
  tutorialBackdrop.style.display = "none";
  clearTutorialHighlight();
  tutorialNext.textContent = "Next";
  localStorage.setItem("tutorialShown", "true");
}

// ==================
// TOOLTIP LOGIC
// ==================

function toggleTooltip() {
  const tooltip = document.getElementById('edu-tooltip');
  const btn = document.getElementById('tooltip-toggle');
  const isVisible = tooltip.classList.contains('active');
  
  if (isVisible) {
    tooltip.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    tooltip.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function updateTooltip(colorName) {
  const tooltipText = document.getElementById('tooltip-text');
  const explanation = colorExplanations[mode][colorName] || "Mix colors to see what happens!";
  tooltipText.textContent = explanation;
}

// Update the result display based on active colors
function updateResult() {
  const current = [...activeColors].sort();
  let result = {
    name: "White",
    hex: "#FFFFFF",
    text: "black",
    glow: false,
  };
  let equation = "Pick a color to start";

  // Default state (Empty)
  if (current.length === 0) {
    if (mode === "RYB") {
      result = {
        name: "White",
        hex: "#FFFFFF",
        text: "black",
        glow: false,
      };
    } else {
      result = {
        name: "Black",
        hex: "#000000",
        text: "white",
        glow: false,
      };
    }
    equation = "Pick a color to start";
  }
  // PAINT MODE (RYB)
  else if (mode === "RYB") {
    if (current.length === 1) {
      const color = current[0];
      if (color === "red") {
        result = {
          name: "Red",
          hex: "#FF4136",
          text: "white",
          glow: false,
        };
        equation = "Selected Red.";
      } else if (color === "blue") {
        result = {
          name: "Blue",
          hex: "#0074D9",
          text: "white",
          glow: false,
        };
        equation = "Selected Blue.";
      } else if (color === "yellow") {
        result = {
          name: "Yellow",
          hex: "#FFDC00",
          text: "black",
          glow: false,
        };
        equation = "Selected Yellow.";
      }
    } else if (current.length === 2) {
      if (current.includes("blue") && current.includes("red")) {
        result = {
          name: "Purple",
          hex: "#B10DC9",
          text: "white",
          glow: false,
        };
        equation = "Mixed Red and Blue. Result is Purple.";
      } else if (current.includes("blue") && current.includes("yellow")) {
        result = {
          name: "Green",
          hex: "#2ECC40",
          text: "white",
          glow: false,
        };
        equation = "Mixed Blue and Yellow. Result is Green.";
      } else if (current.includes("red") && current.includes("yellow")) {
        result = {
          name: "Orange",
          hex: "#FF851B",
          text: "black",
          glow: false,
        };
        equation = "Mixed Red and Yellow. Result is Orange.";
      }
    } else if (current.length === 3) {
      result = {
        name: "Brown",
        hex: "#5b3c11",
        text: "white",
        glow: false,
      };
      equation = "Mixed Red, Yellow, and Blue. Result is Brown.";
    }
  }
  // LIGHT MODE (RGB)
  else {
    if (current.length === 1) {
      const color = current[0];
      if (color === "red") {
        result = {
          name: "Red",
          hex: "#FF0000",
          text: "white",
          glow: true,
        };
        equation = "Selected Red Light.";
      } else if (color === "blue") {
        result = {
          name: "Blue",
          hex: "#0000FF",
          text: "white",
          glow: true,
        };
        equation = "Selected Blue Light.";
      } else if (color === "green") {
        result = {
          name: "Green",
          hex: "#00FF00",
          text: "black",
          glow: true,
        };
        equation = "Selected Green Light.";
      }
    } else if (current.length === 2) {
      if (current.includes("red") && current.includes("green")) {
        result = {
          name: "Yellow",
          hex: "#FFFF00",
          text: "black",
          glow: true,
        };
        equation = "Mixed Red and Green. Result is Yellow.";
      } else if (current.includes("red") && current.includes("blue")) {
        result = {
          name: "Magenta",
          hex: "#FF00FF",
          text: "white",
          glow: true,
        };
        equation = "Mixed Red and Blue. Result is Magenta.";
      } else if (current.includes("green") && current.includes("blue")) {
        result = {
          name: "Cyan",
          hex: "#00FFFF",
          text: "black",
          glow: true,
        };
        equation = "Mixed Green and Blue. Result is Cyan.";
      }
    } else if (current.length === 3) {
      result = {
        name: "White",
        hex: "#FFFFFF",
        text: "black",
        glow: true,
      };
      equation = "Mixed Red, Green, and Blue. Result is White.";
    }
  }

  // Apply result to DOM
  resultBlob.style.backgroundColor = result.hex;
  resultName.textContent = result.name;
  resultName.style.color = result.text;
  equationText.textContent = equation;

  // Update examples
  examples.textContent = `Examples: ${colorExamples[result.name] || "various objects"}`;
  
  // Update tooltip content
  updateTooltip(result.name);

  // Apply Accessibility Patterns to Result Blob
  let existingOverlays = resultBlob.querySelectorAll('.pattern-overlay');
  existingOverlays.forEach(el => el.remove());
  
  if (isAccessibilityMode) {
    activeColors.forEach(color => {
      const overlay = document.createElement('div');
      overlay.className = `pattern-overlay pattern-${color}`;
      // Adjust opacity for mixed colors to stay legible
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
    resultBlob.classList.add('confetti');
    setTimeout(() => resultBlob.classList.remove('confetti'), 1000);
  }

  // Screen Reader Announcement
  let announcement = "";
  if (current.length === 0) {
    announcement = `No colors selected. Canvas is ${result.name}.`;
  } else {
    const joinedColors = current.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(" and ");
    announcement = `Mixed ${joinedColors}. Result is ${result.name}.`;
  }
  srAnnouncer.textContent = announcement;
}

// Copy HEX to clipboard
function copyHex() {
  const hex = currentResultColor.hex;
  navigator.clipboard.writeText(hex).then(() => {
    // Visual feedback
    hexDisplay.classList.add("copied");
    const originalText = hexText.textContent;
    hexText.textContent = "Copied!";
    
    setTimeout(() => {
      hexDisplay.classList.remove("copied");
      hexText.textContent = originalText;
    }, 1500);
  }).catch(err => {
    console.error("Failed to copy: ", err);
    // Fallback feedback
    hexText.textContent = "Copy failed";
    setTimeout(() => {
      hexText.textContent = hex;
    }, 1500);
  });
}

// Share Link
function shareLink() {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set('mode', mode);
  if (activeColors.length > 0) {
    params.set('colors', activeColors.join(','));
  }
  const shareUrl = baseUrl + '?' + params.toString();
  
  navigator.clipboard.writeText(shareUrl).then(() => {
    // Visual feedback
    shareBtn.classList.add("copied");
    const originalText = shareBtn.textContent;
    shareBtn.innerHTML = `
      <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16,6 12,2 8,6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
      Copied!
    `;
    
    setTimeout(() => {
      shareBtn.classList.remove("copied");
      shareBtn.innerHTML = `
        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16,6 12,2 8,6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        Share Link
      `;
    }, 1500);
  }).catch(err => {
    console.error("Failed to copy share link: ", err);
    // Fallback feedback
    shareBtn.innerHTML = `
      <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16,6 12,2 8,6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
      Failed
    `;
    setTimeout(() => {
      shareBtn.innerHTML = `
        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16,6 12,2 8,6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        Share Link
      `;
    }, 1500);
  });
}

// ==================
// KEYBOARD SHORTCUTS
// ==================

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ignore if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (tutorialModal.style.display === "flex") return;
    
    const key = e.key.toLowerCase();
    
    switch (key) {
      case 'r':
        toggleColor('red');
        break;
      case 'y':
        // Yellow only in Paint mode
        if (mode === 'RYB') toggleColor('yellow');
        break;
      case 'g':
        // Green only in Light mode
        if (mode === 'RGB') toggleColor('green');
        break;
      case 'b':
        toggleColor('blue');
        break;
      case ' ':
        e.preventDefault(); // Prevent page scroll
        reset();
        break;
      case 'Tab':
        e.preventDefault(); // Prevent tab navigation
        switchMode(mode === 'RYB' ? 'RGB' : 'RYB');
        break;
    }
  });
}

// Initialize on load
init();
setupKeyboardShortcuts();
