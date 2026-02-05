from playwright.sync_api import sync_playwright, expect
import re

def test_tutorial_modal():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8080")

        # Click Settings to reveal the menu
        settings_btn = page.get_by_role("button", name="Settings")
        settings_btn.click()

        # Click Learn
        learn_btn = page.get_by_role("button", name="Learn", exact=True)
        learn_btn.wait_for(state="visible")
        learn_btn.click()

        # Verify button became active (indicates JS didn't crash)
        expect(learn_btn).to_have_class(re.compile(r"active"))

        # Take screenshot
        page.screenshot(path="verification/tutorial_modal.png")

        browser.close()

if __name__ == "__main__":
    test_tutorial_modal()
