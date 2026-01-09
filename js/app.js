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

// ==================
// SOUND LOGIC
// ==================

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  localStorage.setItem("soundEnabled", isSoundEnabled);
  
  if (isSoundEnabled) {
    soundBtn.classList.add('active');
    soundBtn.setAttribute('aria-pressed', 'true');
    soundIcon.innerHTML = `
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    `;
    // Play confirmation sound
    playPopSound();
  } else {
    soundBtn.classList.remove('active');
    soundBtn.setAttribute('aria-pressed', 'false');
    soundIcon.innerHTML = `
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    `;
  }
}

function playPopSound() {
  if (!isSoundEnabled) return;
  initAudio();
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.1);
}

function playSuccessSound() {
  if (!isSoundEnabled) return;
  initAudio();

  const now = audioCtx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.1);
    
    gain.gain.setValueAtTime(0.1, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.3);
  });
}

// ==================
// DEMO MODE LOGIC
// ==================

const demoSequence = [
  { mode: 'RYB', colors: ['red'] },
  { mode: 'RYB', colors: ['red', 'blue'] },
  { mode: 'RYB', colors: ['blue', 'yellow'] },
  { mode: 'RYB', colors: ['red', 'yellow'] },
  { mode: 'RYB', colors: ['red', 'yellow', 'blue'] },
  { mode: 'RGB', colors: ['red'] },
  { mode: 'RGB', colors: ['red', 'green'] },
  { mode: 'RGB', colors: ['green', 'blue'] },
  { mode: 'RGB', colors: ['red', 'blue'] },
  { mode: 'RGB', colors: ['red', 'green', 'blue'] }
];

let demoIndex = 0;

function toggleDemoMode() {
  isDemoMode = !isDemoMode;
  
  if (isDemoMode) {
    demoBtn.classList.add('active');
    demoBtn.setAttribute('aria-pressed', 'true');
    demoBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
      <span>Stop Demo</span>
    `;
    startDemo();
  } else {
    demoBtn.classList.remove('active');
    demoBtn.setAttribute('aria-pressed', 'false');
    demoBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      <span>Demo Mode</span>
    `;
    stopDemo();
  }
}

function startDemo() {
  demoIndex = 0;
  runDemoStep();
  demoInterval = setInterval(runDemoStep, 3000);
}

function stopDemo() {
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
  }
}

function runDemoStep() {
  const step = demoSequence[demoIndex];
  
  if (mode !== step.mode) {
    switchMode(step.mode, false);
  }
  
  activeColors = [...step.colors];
  renderColorButtons();
  updateResult();
  
  demoIndex = (demoIndex + 1) % demoSequence.length;
}

function startChallenge() {
  const tier = challengeTiers[challengeLevel] || challengeTiers[1];

  // Switch mode if needed for this level
  if (tier.mode !== mode) {
    switchMode(tier.mode, false);
  }

  // Define target hex codes
  const targetDefinitions = {
    "Purple": "#B10DC9", "Green": "#2ECC40", "Orange": "#FF851B", "Brown": "#5b3c11",
    "Yellow": "#FFFF00", "Magenta": "#FF00FF", "Cyan": "#00FFFF", "White": "#FFFFFF"
  };

  // Get targets for current level
  let targets = tier.targets.map(name => ({ name, hex: targetDefinitions[name] }));

  // Pick random target (different from previous if possible)
  let newTarget;
  do {
    newTarget = targets[Math.floor(Math.random() * targets.length)];
  } while (currentTarget && newTarget.name === currentTarget.name && targets.length > 1);

  currentTarget = newTarget;
  
  // Update UI with Level Indicator
  targetName.textContent = `${currentTarget.name} (Lvl ${challengeLevel})`;
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
  playSuccessSound();
  
  // Reset any previous level-up styling
  successMessage.classList.remove('rainbow-text');
  const successCard = successOverlay.querySelector('.success-card');
  successCard.classList.remove('level-up-active');

  // Trigger visual fanfare
  resultBlob.classList.add('pulse-success');
  resultBlob.classList.add('confetti');
  
  // Level Up Logic
  challengeWins++;
  totalWins++;
  localStorage.setItem("totalWins", totalWins);

  // Achievement: Champion (5 wins)
  if (totalWins >= 5) {
    unlockAchievement('champion');
  }

  if (challengeWins >= 3 && challengeLevel < 4) {
    challengeLevel++;
    challengeWins = 0;
    localStorage.setItem("challengeLevel", challengeLevel);
    
    // Delayed Level Up Announcement with enhanced animations
    setTimeout(() => {
       successMessage.textContent = `Level Up! ${challengeTiers[challengeLevel].name} Mode Unlocked! 🚀`;
       successMessage.classList.add('rainbow-text', 'animate-bounce-in');
       successCard.classList.add('level-up-active');
       
       // Play success sound again but with a slight variation (if I had more sound types)
       playSuccessSound();
       
       // Extra confetti for level up
       resultBlob.classList.add('confetti');
    }, 1500);
  }
  
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

// ==================
// LEARNING PATH LOGIC
// ==================

function toggleLearnMode() {
  isLearnMode = !isLearnMode;
  
  if (isLearnMode) {
    // Disable other modes
    if (isChallengeMode) toggleChallengeMode();
    if (isDemoMode) toggleDemoMode();
    
    learnBtn.classList.add('active');
    learnBtn.setAttribute('aria-pressed', 'true');
    currentLearnStep = 0;
    applyLearnStep();
  } else {
    learnBtn.classList.remove('active');
    learnBtn.setAttribute('aria-pressed', 'false');
    // Hide specialized UI if any
    reset();
  }
}

function applyLearnStep() {
  const step = learnPathSteps[currentLearnStep];
  if (!step) return;

  // Update Tutorial Overlay (reusing its UI for guided learning)
  tutorialStep = -1; // Special flag to indicate learn mode
  tutorialBackdrop.style.display = "block";
  tutorialModal.style.display = "flex";
  
  tutorialTitle.textContent = `Learn: ${step.title}`;
  tutorialText.textContent = step.text;
  tutorialNext.style.display = "none"; // User must perform action
  tutorialSkip.textContent = "Exit Lesson";

  // Auto-switch mode if needed
  if (mode !== step.mode) {
    switchMode(step.mode, false);
  }
}

function checkLearnProgress(currentResultName, activeColors) {
  if (!isLearnMode) return;

  const step = learnPathSteps[currentLearnStep];
  if (!step) return;

  // Check if requirement met
  const hasColors = step.require.every(c => activeColors.includes(c)) && activeColors.length === step.require.length;
  
  if (hasColors || (step.require.length === 0 && mode === step.mode && currentLearnStep > 0)) {
    // Success!
    currentLearnStep++;
    if (currentLearnStep < learnPathSteps.length) {
      setTimeout(() => {
        playSuccessSound();
        applyLearnStep();
      }, 800);
    } else {
      // Finished all steps
      setTimeout(() => {
        playSuccessSound();
        tutorialTitle.textContent = "Lesson Complete!";
        tutorialText.textContent = "You've finished the Color Expert course!";
        tutorialNext.style.display = "inline-block";
        tutorialNext.textContent = "Finish";
        tutorialNext.onclick = toggleLearnMode;
      }, 800);
    }
  }
}

// ==================
// ACHIEVEMENTS LOGIC
// ==================

function unlockAchievement(id) {
  if (unlockedAchievements.includes(id)) return;

  const achievement = achievementDefs.find(a => a.id === id);
  if (!achievement) return;

  unlockedAchievements.push(id);
  localStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements));
  
  showAchievementToast(achievement);
}

function showAchievementToast(achievement) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <div class="achievement-icon">${achievement.icon}</div>
    <div class="achievement-text">
      <span class="achievement-title">${achievement.name}</span>
      <span class="achievement-desc">${achievement.desc}</span>
    </div>
  `;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('active'), 100);

  // Play achievement sound (reusing success sound or a variation)
  if (isSoundEnabled) {
    playSuccessSound(); 
  }

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

function toggleAchievementsModal() {
  const isVisible = achievementsModal.style.display === 'flex';
  if (isVisible) {
    achievementsModal.style.display = 'none';
    tutorialBackdrop.style.display = 'none';
  } else {
    renderAchievements();
    achievementsModal.style.display = 'flex';
    tutorialBackdrop.style.display = 'block';
  }
}

function renderAchievements() {
  achievementsList.innerHTML = achievementDefs.map(def => {
    const isUnlocked = unlockedAchievements.includes(def.id);
    const statusClass = isUnlocked ? 'unlocked' : 'locked';
    return `
      <div class="achievement-item ${statusClass}">
        <div class="achievement-item-icon">${isUnlocked ? def.icon : '❓'}</div>
        <div class="achievement-item-name">${def.name}</div>
        <div class="achievement-item-desc">${isUnlocked ? def.desc : 'Keep mixing to find out!'}</div>
      </div>
    `;
  }).join('');
}

function exportReportCard() {
  const date = new Date().toLocaleDateString();
  const unlocked = unlockedAchievements.length;
  const total = achievementDefs.length;
  
  let report = `🎨 COLOR MIXER - REPORT CARD 🎨\n`;
  report += `Date: ${date}\n`;
  report += `-------------------------------\n`;
  report += `Progress: ${unlocked}/${total} Badges Earned\n\n`;
  
  report += `UNLOCKED BADGES:\n`;
  achievementDefs.forEach(def => {
    if (unlockedAchievements.includes(def.id)) {
      report += `✅ ${def.name}: ${def.desc}\n`;
    } else {
      report += `🔒 ${def.name}: (Locked)\n`;
    }
  });
  
  report += `\n-------------------------------\n`;
  report += `Stats:\n`;
  report += `- Challenge Wins: ${achievementStats.challengeWinsTotal}\n`;
  report += `- Colors Mixed: ${achievementStats.mixCount}\n`;
  report += `- Secondary Colors Found: ${achievementStats.secondariesFound.length}/6\n`;
  report += `\nKeep learning and exploring colors! 🌈`;

  // Create blob and download
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ColorMixer_Report_${date.replace(/\//g, '-')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Show feedback
  const exportBtn = document.getElementById('achievements-export');
  const originalText = exportBtn.textContent;
  exportBtn.textContent = '✅ Downloaded!';
  setTimeout(() => exportBtn.textContent = originalText, 2000);
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
    const allowedColors = mode === "RYB" ? ["red", "yellow", "blue"] : ["red", "green", "blue"];
    activeColors = [...new Set(colorsArray.filter(c => allowedColors.includes(c)))];
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

  // Load saved sound preference
  const savedSound = localStorage.getItem("soundEnabled");
  if (savedSound === "true") {
    isSoundEnabled = true;
    soundBtn.classList.add('active');
    soundBtn.setAttribute('aria-pressed', 'true');
    soundIcon.innerHTML = `
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    `;
  } else {
    // Default to false (Opt-in)
    isSoundEnabled = false;
    soundBtn.classList.remove('active');
    soundBtn.setAttribute('aria-pressed', 'false');
    soundIcon.innerHTML = `
      <path d="M11 5L6 9H2v6h4l5 4V5z"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    `;
  }

  // Load saved challenge level
  const savedLevel = localStorage.getItem("challengeLevel");
  if (savedLevel) {
    challengeLevel = parseInt(savedLevel, 10);
  }

  // Load achievements and stats
  const savedAchievements = localStorage.getItem("unlockedAchievements");
  if (savedAchievements) {
    unlockedAchievements = JSON.parse(savedAchievements);
  }

  const savedTotalWins = localStorage.getItem("totalWins");
  if (savedTotalWins) {
    totalWins = parseInt(savedTotalWins, 10);
  }

  // Show tutorial if not shown before
  if (!localStorage.getItem('tutorialShown')) {
    setTimeout(showTutorial, 500); // Delay to let page load
  }

  // Tutorial event listeners
  tutorialNext.addEventListener('click', () => {
    if (isLearnMode) return;
    nextTutorial();
  });
  tutorialSkip.addEventListener('click', () => {
    if (isLearnMode) {
      toggleLearnMode();
      hideTutorial();
    } else {
      skipTutorial();
    }
  });
  tutorialBackdrop.addEventListener('click', () => {
    if (isLearnMode) {
      toggleLearnMode();
      hideTutorial();
    } else {
      skipTutorial();
    }
  });
}

// Render color buttons based on mode
function renderColorButtons() {
  const colors = mode === "RYB" ? paintColors : lightColors;
  const colorOrder =
    mode === "RYB" ? ["red", "yellow", "blue"] : ["red", "green", "blue"];

  colorButtonsContainer.innerHTML = colorOrder
    .map((colorKey) => {
      const color = colors[colorKey];
      const count = activeColors.filter(c => c === color.name).length;
      const isActive = count > 0;
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
      <span class="color-btn-label ${textClass}">${color.name} ${count > 1 ? '<span class="active-count">x' + count + '</span>' : ''}</span>
      <div class="active-indicator ${indicatorClass}"></div>
    </button>
  `;
    })
    .join("");
}

// Toggle color selection
function toggleColor(colorName) {
  if (isDemoMode) toggleDemoMode(); // Stop demo if user interacts
  playPopSound();

  // New logic for Sprint 6: Allow up to 2 clicks of same color for tertiaries
  const count = activeColors.filter(c => c === colorName).length;
  if (count < 2) {
    activeColors.push(colorName);
  } else {
    // Remove all instances of this color to toggle off
    activeColors = activeColors.filter(c => c !== colorName);
  }

  renderColorButtons();
  updateResult();
}

// Deep Color Functions
function updateValue(val) {
  colorValue = parseInt(val);
  valueDisplay.textContent = colorValue + "%";
  updateResult();
}

function getTintedColor(hex, value) {
  // val 0-100: shade (black to color)
  // val 100-200: tint (color to white)
  
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  if (value < 100) {
    // Shade (towards black)
    const factor = value / 100;
    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);
  } else if (value > 100) {
    // Tint (towards white)
    const factor = (value - 100) / 100;
    r = Math.floor(r + (255 - r) * factor);
    g = Math.floor(g + (255 - g) * factor);
    b = Math.floor(b + (255 - b) * factor);
  }

  const newHex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  return newHex;
}

function toggleColorWheel() {
  const isVisible = colorWheelContainer.style.display === 'flex';
  if (isVisible) {
    colorWheelContainer.style.display = 'none';
    wheelBtn.classList.remove('active');
    wheelBtn.setAttribute('aria-pressed', 'false');
  } else {
    colorWheelContainer.style.display = 'flex';
    wheelBtn.classList.add('active');
    wheelBtn.setAttribute('aria-pressed', 'true');
    updateHarmony();
  }
}

function updateHarmony() {
  if (colorWheelContainer.style.display === 'none') return;

  const result = currentResultColor;
  const wheel = document.getElementById('color-wheel');
  
  // Define harmonies mapping
  const harmonies = {
    "Red": { comp: "Cyan", anal: "Rose, Orange" },
    "Blue": { comp: "Yellow", anal: "Violet, Cyan" },
    "Yellow": { comp: "Blue", anal: "Amber, Chartreuse" },
    "Green": { comp: "Magenta", anal: "Chartreuse, Teal" },
    "Orange": { comp: "Azure", anal: "Red, Yellow" },
    "Purple": { comp: "Lime", anal: "Violet, Magenta" },
    "Cyan": { comp: "Red", anal: "Teal, Sky" },
    "Magenta": { comp: "Green", anal: "Rose, Violet" },
    "Vermilion (Red-Orange)": { comp: "Blue-Green", anal: "Red, Orange" },
    "Amber (Yellow-Orange)": { comp: "Blue-Purple", anal: "Yellow, Orange" },
    "Chartreuse (Yellow-Green)": { comp: "Purple", anal: "Yellow, Green" },
    "Teal (Blue-Green)": { comp: "Vermilion", anal: "Blue, Green" },
    "Violet (Blue-Purple)": { comp: "Amber", anal: "Blue, Purple" },
    "Magenta (Red-Purple)": { comp: "Chartreuse", anal: "Red, Purple" },
    "White": { comp: "None (Contains all)", anal: "All" },
    "Black": { comp: "None (Absorbs all)", anal: "None" }
  };

  const info = harmonies[result.name] || { comp: "Unknown", anal: "Unknown" };
  harmonyText.innerHTML = `<strong>Complementary:</strong> ${info.comp}<br><strong>Analogous:</strong> ${info.anal}`;
  
  // Highlight current color on wheel (simplified visual)
  wheel.style.borderColor = result.hex;
}

// Reset all colors
function reset() {
  if (isDemoMode) toggleDemoMode();
  playPopSound();
  activeColors = [];
  renderColorButtons();
  updateResult();
}

// Switch between Paint and Light mode
function switchMode(newMode, shouldSave = true) {
  if (isDemoMode && shouldSave) toggleDemoMode();
  playPopSound();
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

  // Achievement: Mode Switcher (requires trying BOTH modes)
  if (shouldSave) {
    checkModeSwitchAchievement(newMode);
  }
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

  // Apply Sprint 6 Tint/Shade
  const finalHex = getTintedColor(result.hex, colorValue);

  // Apply result to DOM
  resultBlob.style.backgroundColor = finalHex;
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
    // Deduplicate active colors for patterns
    const uniqueColors = [...new Set(activeColors)];
    uniqueColors.forEach((color) => {
      const overlay = document.createElement("div");
      overlay.className = `pattern-overlay pattern-${color}`;
      overlay.style.opacity = activeColors.length > 1 ? "0.15" : "0.25";
      resultBlob.appendChild(overlay);
    });
  }

  // Update HEX display
  currentResultColor = { ...result, hex: finalHex };
  hexText.textContent = finalHex;
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

  // Check achievements
  checkAchievements(result.name, current.length);

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
  // Check Challenge Mode
  checkChallenge(result.name);

  // Check Learning Progress
  checkLearnProgress(result.name, activeColors);

  // Update Color Wheel Harmony
  updateHarmony();
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

// ==================
// ACHIEVEMENT SYSTEM
// ==================

function unlockAchievement(id) {
  // Check if already unlocked
  if (unlockedAchievements.includes(id)) return;
  
  // Find achievement definition
  const achievement = achievementDefs.find(a => a.id === id);
  if (!achievement) return;
  
  // Unlock it
  unlockedAchievements.push(id);
  localStorage.setItem('achievements', JSON.stringify(unlockedAchievements));
  
  // Show toast and play sound
  showAchievementToast(achievement);
  playAchievementSound();
}

function showAchievementToast(achievement) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <span class="achievement-icon">${achievement.icon}</span>
    <div class="achievement-text">
      <strong>Achievement Unlocked!</strong>
      <span>${achievement.name}</span>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Screen reader announcement
  srAnnouncer.textContent = `Achievement unlocked: ${achievement.name}. ${achievement.desc}`;
  
  // Auto-remove after animation
  setTimeout(() => toast.remove(), 3500);
}

function playAchievementSound() {
  if (!isSoundEnabled) return;
  initAudio();

  const now = audioCtx.currentTime;
  // Cheerful ascending arpeggio
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.08);
    
    gain.gain.setValueAtTime(0.15, now + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.2);
  });
}

function saveAchievementStats() {
  localStorage.setItem('achievementStats', JSON.stringify(achievementStats));
}

function checkAchievements(resultName, activeColorCount) {
  // First Mix: Mix any two colors
  if (activeColorCount >= 2 && !unlockedAchievements.includes('first_mix')) {
    achievementStats.mixCount++;
    saveAchievementStats();
    unlockAchievement('first_mix');
  }
  
  // Color Expert: Discover all secondary colors
  const secondaries = ['Orange', 'Purple', 'Green', 'Yellow', 'Magenta', 'Cyan'];
  if (secondaries.includes(resultName) && !achievementStats.secondariesFound.includes(resultName)) {
    achievementStats.secondariesFound.push(resultName);
    saveAchievementStats();
    
    // Check if all 6 discovered (3 RYB + 3 RGB)
    if (achievementStats.secondariesFound.length >= 6) {
      unlockAchievement('color_expert');
    }
  }
}

function checkModeSwitchAchievement(newMode) {
  if (!achievementStats.modesSwitched.includes(newMode)) {
    achievementStats.modesSwitched.push(newMode);
    saveAchievementStats();
    
    // Both modes tried?
    if (achievementStats.modesSwitched.includes('RYB') && achievementStats.modesSwitched.includes('RGB')) {
      unlockAchievement('mode_switcher');
    }
  }
}

function checkChallengeWinAchievement() {
  achievementStats.challengeWinsTotal++;
  saveAchievementStats();
  
  if (achievementStats.challengeWinsTotal >= 5) {
    unlockAchievement('champion');
  }
}

// ==================
// LANGUAGE SELECTOR
// ==================

function toggleLangMenu() {
  const menu = document.getElementById('lang-menu');
  const btn = document.getElementById('lang-toggle');
  const isVisible = menu.style.display !== 'none';
  
  menu.style.display = isVisible ? 'none' : 'block';
  btn.setAttribute('aria-expanded', !isVisible);
  
  // Close menu when clicking outside
  if (!isVisible) {
    setTimeout(() => {
      document.addEventListener('click', closeLangMenuOnClickOutside);
    }, 0);
  }
}

function closeLangMenuOnClickOutside(e) {
  const menu = document.getElementById('lang-menu');
  const btn = document.getElementById('lang-toggle');
  
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.style.display = 'none';
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', closeLangMenuOnClickOutside);
  }
}

// Update UI when language changes
document.addEventListener('languageChanged', (e) => {
  const lang = e.detail.lang;
  
  // Update current language display
  document.getElementById('current-lang').textContent = lang.toUpperCase();
  
  // Close menu
  document.getElementById('lang-menu').style.display = 'none';
  document.getElementById('lang-toggle').setAttribute('aria-expanded', 'false');
  
  // Update header text based on mode
  if (mode === 'RYB') {
    headerTitleText.textContent = t('title_paint');
    headerSubtitle.textContent = t('subtitle_paint');
    footerMainText.textContent = t('footer_paint');
  } else {
    headerTitleText.textContent = t('title_light');
    headerSubtitle.textContent = t('subtitle_light');
    footerMainText.textContent = t('footer_light');
  }
  
  // Re-render color buttons with translated names
  renderColorButtons();
});

// Initialize i18n on load
if (typeof initI18n === 'function') {
  initI18n();
  // Set initial lang display
  const langDisplay = document.getElementById('current-lang');
  if (langDisplay) {
    langDisplay.textContent = getCurrentLanguage().toUpperCase();
  }
}

// ==================
// PRINT WORKSHEET
// ==================

function printWorksheet() {
  // Create printable worksheet content
  const worksheetHTML = `
<!DOCTYPE html>
<html lang="${typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>Color Mixing Worksheet</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Arial', sans-serif; 
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { 
      text-align: center; 
      margin-bottom: 0.5rem;
      color: #1e293b;
    }
    .subtitle {
      text-align: center;
      color: #64748b;
      margin-bottom: 2rem;
    }
    .section { 
      margin-bottom: 2rem;
      page-break-inside: avoid;
    }
    h2 { 
      color: #3b82f6; 
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    .color-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .color-card {
      border: 2px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1rem;
      text-align: center;
    }
    .color-swatch {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin: 0 auto 0.5rem;
      border: 2px solid #cbd5e1;
    }
    .equation {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
    }
    .small-swatch {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: inline-block;
      border: 1px solid #cbd5e1;
    }
    .plus, .equals { font-size: 1.5rem; font-weight: bold; color: #64748b; }
    .result-label { font-weight: bold; margin-left: 0.5rem; }
    .challenge-box {
      border: 2px dashed #3b82f6;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .challenge-box h3 { color: #3b82f6; margin-bottom: 0.5rem; }
    .blank { 
      display: inline-block;
      width: 80px;
      border-bottom: 2px solid #1e293b;
      margin: 0 0.25rem;
    }
    .footer {
      text-align: center;
      color: #94a3b8;
      font-size: 0.875rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }
    @media print {
      body { padding: 1rem; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>🎨 Color Mixing Worksheet</h1>
  <p class="subtitle">Learn how to mix colors like an artist and a scientist!</p>
  
  <div class="section">
    <h2>🖌️ Paint Mixing (Subtractive)</h2>
    <p style="margin-bottom: 1rem;">When we mix paints, colors get <strong>darker</strong>. This is called subtractive color mixing.</p>
    
    <div class="color-grid">
      <div class="color-card">
        <div class="color-swatch" style="background: #FF4136;"></div>
        <strong>Red</strong>
        <p>Primary Color</p>
      </div>
      <div class="color-card">
        <div class="color-swatch" style="background: #FFDC00;"></div>
        <strong>Yellow</strong>
        <p>Primary Color</p>
      </div>
      <div class="color-card">
        <div class="color-swatch" style="background: #0074D9;"></div>
        <strong>Blue</strong>
        <p>Primary Color</p>
      </div>
    </div>
    
    <h3 style="margin: 1.5rem 0 1rem;">Paint Mixing Equations:</h3>
    
    <div class="equation">
      <span class="small-swatch" style="background: #FF4136;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #FFDC00;"></span>
      <span class="equals">=</span>
      <span class="small-swatch" style="background: #FF851B;"></span>
      <span class="result-label">Orange</span>
    </div>
    
    <div class="equation">
      <span class="small-swatch" style="background: #FF4136;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #0074D9;"></span>
      <span class="equals">=</span>
      <span class="small-swatch" style="background: #B10DC9;"></span>
      <span class="result-label">Purple</span>
    </div>
    
    <div class="equation">
      <span class="small-swatch" style="background: #FFDC00;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #0074D9;"></span>
      <span class="equals">=</span>
      <span class="small-swatch" style="background: #2ECC40;"></span>
      <span class="result-label">Green</span>
    </div>
    
    <div class="equation">
      <span class="small-swatch" style="background: #FF4136;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #FFDC00;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #0074D9;"></span>
      <span class="equals">=</span>
      <span class="small-swatch" style="background: #5b3c11;"></span>
      <span class="result-label">Brown</span>
    </div>
  </div>
  
  <div class="section">
    <h2>💡 Light Mixing (Additive)</h2>
    <p style="margin-bottom: 1rem;">When we mix light, colors get <strong>brighter</strong>. This is called additive color mixing.</p>
    
    <div class="color-grid">
      <div class="color-card">
        <div class="color-swatch" style="background: #FF0000;"></div>
        <strong>Red</strong>
        <p>Primary Light</p>
      </div>
      <div class="color-card">
        <div class="color-swatch" style="background: #00FF00;"></div>
        <strong>Green</strong>
        <p>Primary Light</p>
      </div>
      <div class="color-card">
        <div class="color-swatch" style="background: #0000FF;"></div>
        <strong>Blue</strong>
        <p>Primary Light</p>
      </div>
    </div>
    
    <h3 style="margin: 1.5rem 0 1rem;">Light Mixing Equations:</h3>
    
    <div class="equation">
      <span class="small-swatch" style="background: #FF0000;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #00FF00;"></span>
      <span class="equals">=</span>
      <span class="small-swatch" style="background: #FFFF00;"></span>
      <span class="result-label">Yellow</span>
    </div>
    
    <div class="equation">
      <span class="small-swatch" style="background: #FF0000;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #0000FF;"></span>
      <span class="equals">=</span>
      <span class="small-swatch" style="background: #FF00FF;"></span>
      <span class="result-label">Magenta</span>
    </div>
    
    <div class="equation">
      <span class="small-swatch" style="background: #00FF00;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #0000FF;"></span>
      <span class="equals">=</span>
      <span class="small-swatch" style="background: #00FFFF;"></span>
      <span class="result-label">Cyan</span>
    </div>
    
    <div class="equation">
      <span class="small-swatch" style="background: #FF0000;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #00FF00;"></span>
      <span class="plus">+</span>
      <span class="small-swatch" style="background: #0000FF;"></span>
      <span class="equals">=</span>
      <span class="small-swatch" style="background: #FFFFFF; border: 2px solid #1e293b;"></span>
      <span class="result-label">White</span>
    </div>
  </div>
  
  <div class="section">
    <h2>✏️ Challenge: Fill in the Blanks</h2>
    
    <div class="challenge-box">
      <h3>Paint Mixing</h3>
      <p>1. Red + Yellow = <span class="blank"></span></p>
      <p>2. Blue + Yellow = <span class="blank"></span></p>
      <p>3. Red + Blue = <span class="blank"></span></p>
      <p>4. Red + Yellow + Blue = <span class="blank"></span></p>
    </div>
    
    <div class="challenge-box">
      <h3>Light Mixing</h3>
      <p>1. Red + Green = <span class="blank"></span></p>
      <p>2. Green + Blue = <span class="blank"></span></p>
      <p>3. Red + Blue = <span class="blank"></span></p>
      <p>4. Red + Green + Blue = <span class="blank"></span></p>
    </div>
  </div>
  
  <div class="section">
    <h2>🤔 Think About It</h2>
    <p style="margin-bottom: 0.5rem;">1. Why do paint colors get darker when mixed, but light colors get brighter?</p>
    <p style="margin-bottom: 0.5rem;">2. What happens if you mix all three primary paint colors?</p>
    <p style="margin-bottom: 0.5rem;">3. Can you think of real-world examples where we use light mixing? (Hint: TVs, phones)</p>
  </div>
  
  <div class="footer">
    <p>Generated by Color Mixer • colormixer.app</p>
    <p>Date: ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>
  `;
  
  // Open print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(worksheetHTML);
  printWindow.document.close();
  printWindow.focus();
  
  // Auto-print after a short delay
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// ==================
// TEACHER ANALYTICS EXPORT
// ==================

function exportAnalytics() {
  // Gather all relevant data
  const data = {
    exportDate: new Date().toISOString(),
    studentProgress: {
      challengeLevel: challengeLevel,
      totalWins: achievementStats.challengeWinsTotal || 0,
      mixCount: achievementStats.mixCount || 0,
      secondariesFound: achievementStats.secondariesFound || [],
      modesSwitched: achievementStats.modesSwitched || []
    },
    achievements: {
      unlocked: unlockedAchievements || [],
      total: achievementDefs.length,
      percentage: Math.round((unlockedAchievements.length / achievementDefs.length) * 100)
    },
    preferences: {
      language: typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en',
      soundEnabled: isSoundEnabled,
      accessibilityMode: isAccessibilityMode,
      highContrastMode: isHighContrastMode
    }
  };
  
  // Create CSV content
  const csvRows = [
    ['Color Mixer - Student Progress Report'],
    ['Export Date', data.exportDate],
    [''],
    ['=== CHALLENGE PROGRESS ==='],
    ['Current Level', data.studentProgress.challengeLevel],
    ['Total Challenge Wins', data.studentProgress.totalWins],
    ['Total Mixes', data.studentProgress.mixCount],
    [''],
    ['=== COLORS DISCOVERED ==='],
    ['Secondary Colors Found', data.studentProgress.secondariesFound.join(', ') || 'None yet'],
    ['Modes Tried', data.studentProgress.modesSwitched.join(', ') || 'None yet'],
    [''],
    ['=== ACHIEVEMENTS ==='],
    ['Unlocked', `${data.achievements.unlocked.length} / ${data.achievements.total} (${data.achievements.percentage}%)`],
    ...achievementDefs.map(a => [
      a.name, 
      data.achievements.unlocked.includes(a.id) ? '✓ Unlocked' : '○ Locked'
    ]),
    [''],
    ['=== PREFERENCES ==='],
    ['Language', data.preferences.language.toUpperCase()],
    ['Sound Enabled', data.preferences.soundEnabled ? 'Yes' : 'No'],
    ['Accessibility Mode', data.preferences.accessibilityMode ? 'Yes' : 'No'],
    ['High Contrast', data.preferences.highContrastMode ? 'Yes' : 'No']
  ];
  
  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  
  // Download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `color-mixer-progress-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Also return JSON for programmatic use
  return data;
}

// ==================
// SERVICE WORKER REGISTRATION
// ==================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => console.log('Service worker registered.', reg))
      .catch((err) => console.log('Service worker registration failed.', err));
  });
}
