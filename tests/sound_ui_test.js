const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('Test 1: Check Sound Toggle Title Attribute');

// Mock DOM & Browser API
const mockLocalStorage = {
  store: {},
  getItem: (key) => mockLocalStorage.store[key] || null,
  setItem: (key, value) => { mockLocalStorage.store[key] = String(value); }
};

const mockClassList = {
  classes: new Set(),
  add: (c) => mockClassList.classes.add(c),
  remove: (c) => mockClassList.classes.delete(c),
  contains: (c) => mockClassList.classes.has(c)
};

const mockSoundBtn = {
  id: 'sound-toggle-btn',
  classList: mockClassList,
  attributes: {},
  title: '', // This is what we are testing
  setAttribute: (k, v) => { mockSoundBtn.attributes[k] = v; },
  getAttribute: (k) => mockSoundBtn.attributes[k],
  addEventListener: () => {}
};

const mockSoundIcon = {
  id: 'sound-icon',
  innerHTML: ''
};

const mockDocument = {
  getElementById: (id) => {
    if (id === 'sound-toggle-btn') return mockSoundBtn;
    if (id === 'sound-icon') return mockSoundIcon;
    return null;
  }
};

const mockWindow = {
  AudioContext: class {
    constructor() { this.state = 'suspended'; }
    resume() { this.state = 'running'; }
    createOscillator() {
      return {
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {}
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {}
      };
    }
    get currentTime() { return 0; }
  },
  localStorage: mockLocalStorage,
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  document: mockDocument
};

// Create VM Context
const context = vm.createContext({
  window: mockWindow,
  document: mockDocument,
  localStorage: mockLocalStorage,
  console: console
});

// Load js/sound.js
const soundJs = fs.readFileSync(path.join(__dirname, '../js/sound.js'), 'utf8');

try {
  vm.runInContext(soundJs, context);

  // Initialize
  context.window.SoundManager.init();

  // Initial State Check (Default is Sound Enabled based on mocks matches:false -> !false = true)
  // Wait, if matchMedia matches is false (not reduced motion), sound is enabled by default.
  // Let's check the logic:
  // if (savedSound !== null) ... else isSoundEnabled = !mediaQuery.matches;

  // So initial state should be ENABLED (true).
  // Expected Title: "Mute Sound"

  if (mockSoundBtn.title !== 'Mute Sound') {
     console.error(`❌ Initial State Failed: Expected title 'Mute Sound', got '${mockSoundBtn.title}'`);
     // We expect this to fail currently
  } else {
     console.log(`✅ Initial State Passed: Title is '${mockSoundBtn.title}'`);
  }

  // Toggle Sound (Disable)
  context.window.SoundManager.toggle();

  if (mockSoundBtn.title !== 'Enable Sound') {
     console.error(`❌ Toggle Off Failed: Expected title 'Enable Sound', got '${mockSoundBtn.title}'`);
  } else {
     console.log(`✅ Toggle Off Passed: Title is '${mockSoundBtn.title}'`);
  }

  // Toggle Sound (Enable)
  context.window.SoundManager.toggle();

  if (mockSoundBtn.title !== 'Mute Sound') {
     console.error(`❌ Toggle On Failed: Expected title 'Mute Sound', got '${mockSoundBtn.title}'`);
  } else {
     console.log(`✅ Toggle On Passed: Title is '${mockSoundBtn.title}'`);
  }

} catch (e) {
  console.error('Test Error:', e);
  process.exit(1);
}
