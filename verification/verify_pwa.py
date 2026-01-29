from playwright.sync_api import sync_playwright

def verify_app(page):
    page.goto("http://localhost:8080")

    # Wait for page to load
    page.wait_for_load_state("networkidle")

    # Check title
    title = page.title()
    print(f"Page title: {title}")

    # Take screenshot of the main page
    page.screenshot(path="verification/app_home.png")

    # Verify Service Worker registration (via JS)
    sw_status = page.evaluate("async () => { try { const reg = await navigator.serviceWorker.getRegistration(); return reg ? 'Registered' : 'Not Registered'; } catch(e) { return e.toString(); } }")
    print(f"Service Worker Status: {sw_status}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_app(page)
        finally:
            browser.close()
