from playwright.sync_api import sync_playwright, expect
import sys

def verify_tools_menu(page):
    print("Navigating...")
    page.goto('http://localhost:8080/')

    # Check for Tools button
    print("Looking for tools button...")
    tools_btn = page.locator('#tools-toggle-btn')
    expect(tools_btn).to_be_visible()

    # Click it
    print("Clicking tools button...")
    tools_btn.click()

    # Check for dropdown menu
    print("Looking for menu...")
    menu = page.locator('#tools-menu')
    expect(menu).to_be_visible()

    # Check for items inside
    print("Checking items...")
    print_btn = page.locator('#print-worksheet-btn')
    expect(print_btn).to_be_visible()

    # Take screenshot of open menu
    print("Taking screenshot...")
    page.screenshot(path='verification/tools_menu.png')
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_tools_menu(page)
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)
        finally:
            browser.close()
