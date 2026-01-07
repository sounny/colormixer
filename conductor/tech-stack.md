# Technology Stack

## 1. Core Technologies
*   **Language:** Vanilla JavaScript (ES6+). No transpilation or external runtimes are required.
*   **Structure:** HTML5 for semantic structure.
*   **Styling:** CSS3, utilizing CSS Custom Properties (Variables) for theming and clean transitions.
*   **Icons:** Custom Inline SVGs for lightweight, asset-free visual cues.

## 2. External Dependencies
*   **Typography:** Google Fonts API for the "Inter" font family to ensure high-quality, modern typography across platforms.

## 3. Architecture & Build Process
*   **No-Build Workflow:** The application utilizes a modular directory structure (`css/`, `js/`), requiring no build step, bundling (Webpack/Vite), or package managers.
*   **Local Compatibility:** Assets are loaded using standard `<link>` and `<script>` tags (without `type="module"`) to ensure full compatibility with the `file://` protocol when opened directly in a browser.
*   **Client-Side Logic:** All state management and mixing calculations are performed entirely in the user's browser.

## 4. Development Standards
*   **Browser Compatibility:** Targeted for modern evergreen browsers (Chrome, Firefox, Safari, Edge).
*   **Modular Organization:** Logic and styles are separated into logical files to improve maintainability while keeping the code accessible for educational review.
