# Product Guidelines

## 1. Visual Identity & UI Design
*   **Aesthetic:** Playful & Vibrant. The interface should utilize bright, saturated colors that reflect the core subject matter.
*   **Shapes:** Use rounded corners and soft edges for buttons and containers to create a non-intimidating, friendly atmosphere for younger learners.
*   **Animations:** Implement cheerful, bouncy transitions when colors are mixed or modes are toggled. These provide positive feedback and make the interaction feel tactile and alive.
*   **Imagery:** Use simple, bold SVG icons (like the existing Palette and Zap) to clearly differentiate between "Paint" and "Light" modes.

## 2. Voice & Tone
*   **Supportive & Inclusive:** Use an encouraging and friendly voice ("Let's try mixing...") to guide the user.
*   **Inquiry-Based:** Spark curiosity by asking open-ended questions in the UI (e.g., "What happens if we add more red?").
*   **Pedagogical Balance:** While keeping the primary tone light, introduce precise scientific terminology (pigment absorption, additive synthesis) where appropriate, providing clear, simple definitions to ensure it remains educational for all ages (K-12 to Undergrad).

## 3. Accessibility & Inclusivity
*   **Color Vision Deficiency (CVD) Support:** Implement texture and pattern overlays (e.g., stripes for Red, dots for Blue) so that users can identify color components without relying solely on hue.
*   **Semantic Labeling:** Every result must be accompanied by a clear text label (e.g., "Result: Purple") and a breakdown of its components ("Red + Blue").
*   **High Contrast:** UI controls must maintain high contrast against backgrounds to ensure visibility for all users.
*   **Screen Reader Friendly:** Use ARIA live regions to announce color changes and mixing results to assist users with visual impairments.

## 4. Brand Values
*   **Learning through Play:** Experimentation is the primary interaction. There are no "wrong" mixes.
*   **Scientific Accuracy:** The mixing logic must faithfully represent the physical and digital realities of RYB and RGB systems.
*   **Simplicity:** Minimize clutter. Every element on the screen should serve a clear educational or functional purpose.
