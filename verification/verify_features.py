from playwright.sync_api import sync_playwright
import sys

def verify_features():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Open local file
        import os
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/index.html")

        print(f"Page Title: {page.title()}")

        # 1. Verify Sound Toggle
        sound_btn = page.locator("#sound-toggle-btn")
        if sound_btn.count() > 0:
            print("✅ Sound Toggle Button found")
            label = sound_btn.text_content()
            print(f"   Label: {label.strip()}")
        else:
            print("❌ Sound Toggle Button NOT found")
            sys.exit(1)

        # 2. Verify Manifest Link
        manifest = page.locator('link[rel="manifest"]')
        if manifest.count() > 0:
            print("✅ Manifest link found")
            href = manifest.get_attribute("href")
            print(f"   Href: {href}")
        else:
            print("❌ Manifest link NOT found")
            sys.exit(1)

        # 3. Verify Service Worker Registration (Basic check of script content)
        # We can't easily verify the SW is *running* in a file:// protocol without secure context,
        # but we can check if the registration code exists in the page source or script.
        # However, checking if the script tag exists is good enough for static verification.
        content = page.content()
        if "serviceWorker" in content and "register" in content:
             print("✅ Service Worker registration code found in content")
        else:
             print("❌ Service Worker registration code NOT found")
             sys.exit(1)

        # Screenshot
        page.screenshot(path="verification/features_verified.png")
        print("📸 Screenshot saved to verification/features_verified.png")

        browser.close()

if __name__ == "__main__":
    verify_features()
