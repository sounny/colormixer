// ==================
// SOUND MANAGER
// ==================

window.SoundManager = (function() {
  let audioCtx = null;
  let isSoundEnabled = false;
  let soundBtn = null;
  let soundIcon = null;

  const SOUND_ON_ICON = `
    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  `;

  const SOUND_OFF_ICON = `
    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  `;

  function init() {
    soundBtn = document.getElementById('sound-toggle-btn');
    soundIcon = document.getElementById('sound-icon');

    // Check localStorage first
    const savedSound = localStorage.getItem("soundEnabled");

    if (savedSound !== null) {
      // User has explicit preference
      isSoundEnabled = savedSound === "true";
    } else {
      // No preference saved, check system preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // If user prefers reduced motion, default sound to OFF (less sensory input)
      // Otherwise default to ON (or whatever the app default was, which seemed to be ON)
      // Actually, standard practice for auto-play audio is OFF, but for UI feedback it's often ON.
      // However, the prompt implies "respects prefers-reduced-motion".
      // I'll default to TRUE unless reduced motion is detected.
      isSoundEnabled = !prefersReducedMotion;
    }

    updateUI();
  }

  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function updateUI() {
    if (!soundBtn || !soundIcon) return;

    if (isSoundEnabled) {
      soundBtn.classList.add('active');
      soundBtn.setAttribute('aria-pressed', 'true');
      soundIcon.innerHTML = SOUND_ON_ICON;
    } else {
      soundBtn.classList.remove('active');
      soundBtn.setAttribute('aria-pressed', 'false');
      soundIcon.innerHTML = SOUND_OFF_ICON;
    }
  }

  function toggle() {
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem("soundEnabled", isSoundEnabled);
    updateUI();

    // Resume context if needed when enabling
    if (isSoundEnabled) {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      playPop(); // Feedback so user knows sound is on
    }
  }

  function playPop() {
    if (!isSoundEnabled) return;
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

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

  function playSuccess() {
    if (!isSoundEnabled) return;
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

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

  function playAchievement() {
    if (!isSoundEnabled) return;
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

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

  // Public API
  return {
    init,
    toggle,
    playPop,
    playSuccess,
    playAchievement,
    get isEnabled() { return isSoundEnabled; }
  };
})();
