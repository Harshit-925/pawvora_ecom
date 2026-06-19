import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:5173")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the visible 'Shop Now' button in the hero section to open the products showcase so the category strip and product grid become visible.
        # Shop Now link
        elem = page.get_by_role('link', name='Shop Now', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Dogs' category link in the page header to apply the Dogs filter and trigger the product grid update.
        # Dogs link
        elem = page.get_by_role('link', name='Dogs', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Dog Food' button in the on-page category strip to apply the Dogs category filter so the product grid should update to dog products.
        # 🐕 Dog Food button
        elem = page.get_by_role('button', name='Dog Food', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the product grid updates to match the selected category
        # Assert: The URL contains '#dogs', indicating the Dogs category filter was applied.
        await expect(page).to_have_url(re.compile("\\#dogs"), timeout=15000), "The URL contains '#dogs', indicating the Dogs category filter was applied."
        await page.locator("xpath=/html/body/div/main/section[2]/div/div[2]/button[2]").nth(0).scroll_into_view_if_needed()
        # Assert: The 'Dog Food' category button is visible on the page, confirming the selected category is shown.
        await expect(page.locator("xpath=/html/body/div/main/section[2]/div/div[2]/button[2]").nth(0)).to_be_visible(timeout=15000), "The 'Dog Food' category button is visible on the page, confirming the selected category is shown."
        
        # --> Verify filtered product cards are visible
        # Assert: A filtered product card with price "$ 45.99" is visible.
        await expect(page.locator("xpath=/html/body/div/main/section[3]/div/div[2]/div/div[1]/div/div[1]/div/div[2]/div[2]/span").nth(0)).to_have_text("$ 45.99", timeout=15000), "A filtered product card with price \"$ 45.99\" is visible."
        # Assert: A filtered product card with price "$ 18.99" is visible.
        await expect(page.locator("xpath=/html/body/div/main/section[3]/div/div[2]/div/div[1]/div/div[3]/div/div[2]/div[2]/span").nth(0)).to_have_text("$ 18.99", timeout=15000), "A filtered product card with price \"$ 18.99\" is visible."
        # Assert: A filtered product card with price "$ 15.99" is visible.
        await expect(page.locator("xpath=/html/body/div/main/section[3]/div/div[2]/div/div[1]/div/div[4]/div/div[2]/div[2]/span").nth(0)).to_have_text("$ 15.99", timeout=15000), "A filtered product card with price \"$ 15.99\" is visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    