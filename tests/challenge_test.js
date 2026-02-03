
const assert = require('assert');
const fs = require('fs');

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

// Mock DOM elements
const domMock = {
  classList: {
    add: () => {},
    remove: () => {},
    contains: () => false
  },
  textContent: '',
  style: {},
  innerHTML: '',
  querySelector: () => domMock,
  querySelectorAll: () => [],
  setAttribute: () => {},
  addEventListener: () => {},
  appendChild: () => {},
  remove: () => {},
  focus: () => {},
  scrollIntoView: () => {}
};

// Mock document
global.document = {
  getElementById: (id) => {
      // Return a basic mock
      return { ...domMock, value: 50 };
  },
  querySelector: () => domMock,
  querySelectorAll: () => [],
  createElement: () => domMock,
  body: domMock,
  addEventListener: () => {}
};

global.window = {
  matchMedia: () => ({ matches: false }),
  addEventListener: () => {},
  location: { search: '' },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  URLSearchParams: class { get() { return null; } },
  SoundManager: {
      init: () => {},
      playPop: () => {},
      playSuccess: () => {},
      playAchievement: () => {}
  }
};

global.navigator = global.window.navigator;
global.URLSearchParams = global.window.URLSearchParams;

// Mock SoundManager global if the file expects it or creates it
global.SoundManager = global.window.SoundManager;

// Load app code using eval (to access internal state/functions)
const stateCode = fs.readFileSync('js/state.js', 'utf8');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const vm = require('vm');
const code = stateCode + '\n' + appCode;

// Sandbox with all necessary globals
const sandbox = {
    window: global.window,
    document: global.document,
    localStorage: global.localStorage,
    navigator: global.navigator,
    URLSearchParams: global.window.URLSearchParams,
    console: console,
    setTimeout: (fn) => fn(), // Instant timeout
    setInterval: () => {},
    clearInterval: () => {},
    alert: () => {},
    SoundManager: global.SoundManager
};

vm.createContext(sandbox);

try {
    vm.runInContext(code, sandbox);
} catch (e) {
    // If init fails due to missing DOM elements or timing, we might still have defined functions
    console.log("Warning during app init (expected in mock env):", e.message);
}

// Now we can access functions via sandbox
// We need to ensure global variables like isChallengeMode are accessible.
// In vm context, top-level lets might not be on the sandbox object directly if they are block scoped.
// But in 'vm.runInContext', 'var' or 'function' declarations should be on sandbox.
// 'let' declarations in the top level of the script are top-level scope of the script, not global property.
// But we can try to access them if we append a getter.

// Re-run a small snippet to extract the state
const extractionCode = `
({
    checkChallenge: typeof checkChallenge !== 'undefined' ? checkChallenge : null,
    setChallengeMode: (val) => { isChallengeMode = val; },
    setTarget: (val) => { currentTarget = val; },
    getWins: () => challengeWins,
    setWins: (val) => { challengeWins = val; },
    getLevel: () => challengeLevel,
    getIsChallengeMode: () => isChallengeMode
})
`;
const app = vm.runInContext(extractionCode, sandbox);

console.log("Test 1: Check Challenge Mode Logic via VM");

if (!app.checkChallenge) {
    console.error("Failed to retrieve checkChallenge function from VM");
    process.exit(1);
}

// Setup Challenge Mode
app.setChallengeMode(true);
app.setTarget({ name: "Orange", hex: "#FF851B" });
app.setWins(0);

// Test
app.checkChallenge("Orange");

// Verify
assert.strictEqual(app.getWins(), 1, "Wins should increment to 1");

// Test Fail
app.checkChallenge("Purple");
assert.strictEqual(app.getWins(), 1, "Wins should stay 1");

// Test Level Up (Need 3 wins)
app.checkChallenge("Orange"); // 2
app.checkChallenge("Orange"); // 3 -> Level Up

assert.strictEqual(app.getLevel(), 2, "Should level up to 2");
assert.strictEqual(app.getWins(), 0, "Wins should reset");

console.log("✅ Real App Code Logic Verified!");
