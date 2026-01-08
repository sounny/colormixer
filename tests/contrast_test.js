const fs = require('fs');
const path = require('path');

// Helper: Parse Hex to RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Helper: Calculate Luminance
function getLuminance({ r, g, b }) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Helper: Calculate Contrast Ratio
function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(hexToRgb(color1));
    const lum2 = getLuminance(hexToRgb(color2));
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

// Main Test
try {
    const cssPath = path.join(__dirname, '../css/reset.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    // Extract :root block
    const rootBlockMatch = css.match(/:root\s*{([^}]+)}/s);
    if (!rootBlockMatch) {
        throw new Error('Could not find :root CSS block in css/reset.css');
    }
    const rootContent = rootBlockMatch[1];

    // Parse variables
    const vars = {};
    const varRegex = /--([a-zA-Z0-9-]+):\s*(#[0-9a-fA-F]{3,6})/g;
    let match;
    while ((match = varRegex.exec(rootContent)) !== null) {
        vars[match[1]] = match[2];
    }

    // Define pairs to check (Background, Foreground)
    const pairs = [
        { bg: 'paint-bg', fg: 'paint-text-primary', name: 'Paint Mode: Background vs Primary Text' },
        { bg: 'paint-card', fg: 'paint-text-primary', name: 'Paint Mode: Card vs Primary Text' },
        { bg: 'paint-bg', fg: 'paint-text-secondary', name: 'Paint Mode: Background vs Secondary Text' },
        { bg: 'paint-bg', fg: 'paint-text-muted', name: 'Paint Mode: Background vs Muted (Footer)' },
        { bg: 'light-bg', fg: 'light-text-primary', name: 'Light Mode: Background vs Primary Text' },
        { bg: 'light-card', fg: 'light-text-primary', name: 'Light Mode: Card vs Primary Text' },
        { bg: 'light-bg', fg: 'light-text-muted', name: 'Light Mode: Background vs Muted (Footer)' },
        // Achievement Toast Colors (Hardcoded in CSS, so adding manual checks here)
        // Updated to darker values for WCAG AA
        { bg: '#047857', fg: '#ffffff', name: 'Achievement Toast (Green) vs White Text' },
        { bg: '#2563eb', fg: '#ffffff', name: 'Achievement Toast (Blue) vs White Text' }
    ];

    let allPass = true;
    console.log('Running Contrast Ratio Tests (Target: AA >= 4.5:1)\n');

    pairs.forEach(pair => {
        let bgHex = pair.bg.startsWith('#') ? pair.bg : vars[pair.bg];
        let fgHex = pair.fg.startsWith('#') ? pair.fg : vars[pair.fg];

        if (!bgHex || !fgHex) {
            console.error(`❌ [${pair.name}] Missing color variables: ${pair.bg} or ${pair.fg}`);
            allPass = false;
            return;
        }

        const ratio = getContrastRatio(bgHex, fgHex);
        const pass = ratio >= 4.5;
        
        const status = pass ? '✅' : '❌';
        console.log(`${status} [${pair.name}] Ratio: ${ratio.toFixed(2)}:1 (BG: ${bgHex}, FG: ${fgHex})`);

        if (!pass) {
            allPass = false;
        }
    });

    if (!allPass) {
        console.error('\nTests Failed: Some color combinations do not meet WCAG AA standards.');
        process.exit(1);
    } else {
        console.log('\nAll tests passed!');
        process.exit(0);
    }

} catch (err) {
    console.error('Test script error:', err);
    process.exit(1);
}
