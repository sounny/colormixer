const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

// Mocks
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();

// Detailed DOM Mock to track calls
const elementMocks = {};
const getElementMock = (id) => {
    if (!elementMocks[id]) {
        elementMocks[id] = {
            id,
            classList: {
                classes: new Set(),
                add: function(c) { this.classes.add(c); },
                remove: function(c) { this.classes.delete(c); },
                contains: function(c) { return this.classes.has(c); }
            },
            attributes: {},
            setAttribute: function(k, v) { this.attributes[k] = v; },
            innerHTML: '',
            textContent: '',
            style: {},
            addEventListener: () => {},
            // Methods needed for updateResult
            querySelectorAll: () => [],
            appendChild: () => {},
            remove: () => {},
            scrollIntoView: () => {},
            focus: () => {},
            blur: () => {},
            click: () => {},
            querySelector: () => null // For successOverlay.querySelector
        };
    }
    return elementMocks[id];
};

const documentMock = {
    getElementById: (id) => getElementMock(id),
    querySelector: (sel) => getElementMock(sel),
    querySelectorAll: () => [],
    body: getElementMock('body'),
    createElement: () => getElementMock('created'),
    addEventListener: () => {}
};

const matchMediaMock = (query) => ({
    matches: false,
    addEventListener: () => {}
});

const audioContextMock = class {
    constructor() { this.state = 'suspended'; }
    resume() { this.state = 'running'; }
    createOscillator() {
        return {
            type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
            connect: () => {}, start: () => {}, stop: () => {}
        };
    }
    createGain() {
        return {
            gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
            connect: () => {}
        };
    }
};

const sandbox = {
    window: {
        localStorage: localStorageMock,
        matchMedia: matchMediaMock,
        AudioContext: audioContextMock,
        webkitAudioContext: audioContextMock,
        document: documentMock,
        setTimeout: (fn) => fn(),
        location: { search: '' },
        URLSearchParams: class { get() { return null; } },
        navigator: { serviceWorker: { register: () => Promise.resolve() }, clipboard: { writeText: () => Promise.resolve() } },
        SoundManager: null // Will be set by sound.js
    },
    document: documentMock,
    localStorage: localStorageMock,
    console: console,
    setTimeout: (fn) => fn(),
    setInterval: () => {},
    clearInterval: () => {}
};
sandbox.navigator = sandbox.window.navigator;
sandbox.URLSearchParams = sandbox.window.URLSearchParams;

// Read files
const soundCode = fs.readFileSync('js/sound.js', 'utf8');
const stateCode = fs.readFileSync('js/state.js', 'utf8');
const appCode = fs.readFileSync('js/app.js', 'utf8');

vm.createContext(sandbox);

// 1. Run Sound Code
console.log("Running js/sound.js...");
vm.runInContext(soundCode, sandbox);

// Verify SoundManager exists
if (!sandbox.window.SoundManager) {
    console.error("SoundManager not created!");
    process.exit(1);
}

// 2. Run State Code
console.log("Running js/state.js...");
vm.runInContext(stateCode, sandbox);

// 3. Run App Code (which calls init -> SoundManager.init)
console.log("Running js/app.js...");
try {
    vm.runInContext(appCode, sandbox);
} catch (e) {
    console.error("App execution error:", e);
    // Continue even if init failed, to debug
}

// 4. Verify Integration
const sm = sandbox.window.SoundManager;
const soundBtn = elementMocks['sound-toggle-btn'];

console.log("Verifying SoundManager state...");
// Default should be true
assert.strictEqual(sm.isEnabled, true, "Sound should be enabled by default (init should have run)");

// Verify UI sync (SoundManager.init should have been called by app.js init)
// Check if soundBtn has 'active' class
assert.ok(soundBtn.classList.contains('active'), "Sound button should have active class initially");
assert.strictEqual(soundBtn.attributes['aria-pressed'], 'true', "Sound button should have aria-pressed=true");

// Toggle
console.log("Toggling sound...");
sm.toggle();
assert.strictEqual(sm.isEnabled, false, "Sound should be disabled after toggle");
assert.strictEqual(localStorageMock.getItem("soundEnabled"), "false", "localStorage should be updated");

// Verify UI update
assert.strictEqual(soundBtn.classList.contains('active'), false, "Sound button should NOT have active class after toggle");
assert.strictEqual(soundBtn.attributes['aria-pressed'], 'false', "Sound button should have aria-pressed=false");

// Toggle back
sm.toggle();
assert.strictEqual(sm.isEnabled, true, "Sound should be enabled");
assert.ok(soundBtn.classList.contains('active'), "Sound button should have active class again");

console.log("✅ Sound Verification Passed!");
