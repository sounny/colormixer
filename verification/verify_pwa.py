
from playwright.sync_api import sync_playwright

def verify_pwa(page):
    page.goto("http://localhost:8080/index.html")

    # Check if manifest is linked
    manifest_link = page.locator('link[rel="manifest"]')
    if manifest_link.count() > 0:
        print("Manifest link found!")
    else:
        print("Manifest link NOT found!")

    # Check if PWA installation criteria are met (basic check by ensuring page loads and no errors)
    # We can also check console logs for service worker registration
    page.on("console", lambda msg: print(f"Console: {msg.text}"))

    # Wait a bit for SW registration
    page.wait_for_timeout(2000)

    # Take screenshot of the app loaded
    page.screenshot(path="verification/pwa_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_pwa(page)
        browser.close()
