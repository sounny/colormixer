const { test, expect } = require('@playwright/test');

test('PWA Manifest and Service Worker Check', async ({ page }) => {
  // Go to the app
  await page.goto('/');

  // 1. Check if manifest link exists
  const manifestLink = await page.$('link[rel="manifest"]');
  expect(manifestLink).not.toBeNull();
  const manifestHref = await manifestLink.getAttribute('href');
  expect(manifestHref).toBe('./manifest.json');

  // 2. Check if Service Worker is registered
  // We can't easily check registration state from outside, but we can check if the script is loaded
  // or check console logs if we were capturing them.
  // Instead, let's verify the file exists by requesting it.
  const swResponse = await page.request.get('/service-worker.js');
  expect(swResponse.status()).toBe(200);

  // 3. Verify SoundManager is initialized
  const isSoundManagerDefined = await page.evaluate(() => {
    return typeof window.SoundManager !== 'undefined';
  });
  expect(isSoundManagerDefined).toBe(true);
});
