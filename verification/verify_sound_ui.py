
from playwright.sync_api import sync_playwright
import os

def verify_color_mixer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the local index.html directly using absolute path /app/index.html
        page.goto('file:///app/index.html')

        # Wait for the page to be ready
        page.wait_for_selector('body')

        # Test interaction 1: Toggle Sound (Visual check)
        # Sound defaults to enabled (if no reduced motion), icon should reflect that
        # We can't hear sound in headless, but we can check the class

        # Toggle Sound OFF
        page.click('#sound-toggle-btn')
        page.wait_for_timeout(200)

        # Toggle Sound ON (Should trigger playPop, but we just check visual state)
        page.click('#sound-toggle-btn')
        page.wait_for_timeout(200)

        # Toggle Accessibility Mode
        page.click('#accessibility-toggle-btn')
        page.wait_for_timeout(500) # Wait for visual update

        # Take a screenshot
        page.screenshot(path='verification/verification.png')

        browser.close()

if __name__ == '__main__':
    verify_color_mixer()
