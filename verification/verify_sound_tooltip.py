from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8080")

        # Wait for app to load
        page.wait_for_selector("#sound-toggle-btn")

        # Check initial state (should be title="Mute Sound" or "Enable Sound" depending on default)
        # Default sound is ON (Opt-out) usually, so title should be "Mute Sound".
        # But wait, logic: isSoundEnabled = !mediaQuery.matches;
        # If reduced motion is OFF (default), sound is ON.

        btn = page.locator("#sound-toggle-btn")

        # Verify initial title
        initial_title = btn.get_attribute("title")
        print(f"Initial Title: {initial_title}")

        # Verify aria-pressed
        initial_aria = btn.get_attribute("aria-pressed")
        print(f"Initial Aria-Pressed: {initial_aria}")

        # Take screenshot 1
        page.screenshot(path="verification/sound_btn_initial.png")

        # Click to toggle
        print("Clicking sound button...")
        btn.click()

        # Verify new title
        new_title = btn.get_attribute("title")
        print(f"New Title: {new_title}")

        # Verify new aria-pressed
        new_aria = btn.get_attribute("aria-pressed")
        print(f"New Aria-Pressed: {new_aria}")

        # Take screenshot 2
        page.screenshot(path="verification/sound_btn_toggled.png")

        browser.close()

if __name__ == "__main__":
    run()
