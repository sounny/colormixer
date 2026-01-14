
from playwright.sync_api import sync_playwright

def verify_pwa(page):
    page.goto("http://localhost:8080/")

    # 1. Check for Manifest
    manifest_link = page.locator('link[rel="manifest"]')
    if manifest_link.count() > 0:
        print("✅ Manifest link found.")
    else:
        print("❌ Manifest link missing.")

    # 2. Check for SoundManager
    is_sound_manager = page.evaluate("typeof window.SoundManager !== 'undefined'")
    if is_sound_manager:
        print("✅ SoundManager is initialized.")
    else:
        print("❌ SoundManager is NOT initialized.")

    # 3. Check for Service Worker Registration
    # We wait a bit to ensure the registration code runs
    page.wait_for_timeout(1000)
    # Check if we can fetch the service worker file
    response = page.request.get("http://localhost:8080/service-worker.js")
    if response.status == 200:
        print("✅ Service Worker file is accessible.")
        content = response.text()
        if "js/sound.js" in content and "js/i18n.js" in content:
             print("✅ Service Worker caches sound.js and i18n.js.")
        else:
             print("❌ Service Worker is MISSING sound.js or i18n.js in ASSETS list.")
    else:
        print("❌ Service Worker file not found.")

    page.screenshot(path="/home/jules/verification/pwa_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_pwa(page)
        finally:
            browser.close()
