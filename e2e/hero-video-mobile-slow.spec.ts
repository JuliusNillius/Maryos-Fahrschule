import { test } from '@playwright/test';

/**
 * Schmaler Viewport + Chrome „Slow 3G“ (CDP): Hero-Mobile-Video soll ohne Tap laufen,
 * sobald genug Daten da sind (canplay / playVisible-Retries).
 */
test.describe('Hero-Video mobil + Slow 3G', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  test('sichtbares Hero-Video spielt nach Laden ohne Pause', async ({ page, context }) => {
    test.setTimeout(180_000);

    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    // Chromium-Preset nahe „Slow 3G“: ~400 kbit/s, hohe Latenz
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 2000,
      downloadThroughput: (400 * 1024) / 8,
      uploadThroughput: (400 * 1024) / 8,
    });

    await page.goto('/de', { waitUntil: 'domcontentloaded', timeout: 90_000 });

    await page.waitForFunction(
      () => {
        const vids = [...document.querySelectorAll<HTMLVideoElement>('.hero-video-wrap video')];
        const v = vids.find((el) => {
          const cs = getComputedStyle(el);
          return cs.display !== 'none' && cs.visibility !== 'hidden';
        });
        return !!v && !v.paused && (v.readyState >= 2 || v.currentTime > 0);
      },
      null,
      { timeout: 150_000 },
    );
  });
});
