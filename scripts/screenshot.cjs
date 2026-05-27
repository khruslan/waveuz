const { chromium, devices } = require("@playwright/test");

(async () => {
  const URL = "http://127.0.0.1:3001/";
  console.log("Launching chromium...");
  const browser = await chromium.launch();

  // Desktop
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-US" });
  const dpage = await desktop.newPage();
  await dpage.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await dpage.addStyleTag({ content: "#loader{display:none!important;}" });
  await dpage.waitForTimeout(2500);
  await dpage.screenshot({ path: "test-results/ui-desktop-hero.png", fullPage: false });
  await dpage.evaluate(() => window.scrollTo({ top: document.querySelector("#stats")?.offsetTop || 0 }));
  await dpage.waitForTimeout(800);
  await dpage.screenshot({ path: "test-results/ui-desktop-stats.png", fullPage: false });
  await dpage.evaluate(() => window.scrollTo({ top: document.querySelector("#services-pin")?.offsetTop || 0 }));
  await dpage.waitForTimeout(800);
  await dpage.screenshot({ path: "test-results/ui-desktop-services.png", fullPage: false });
  await desktop.close();

  // Mobile
  const mobile = await browser.newContext({ ...devices["iPhone 15"], locale: "en-US" });
  const mpage = await mobile.newPage();
  await mpage.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await mpage.addStyleTag({ content: "#loader{display:none!important;}" });
  await mpage.waitForTimeout(2500);
  await mpage.screenshot({ path: "test-results/ui-mobile-hero.png", fullPage: false });
  await mobile.close();

  await browser.close();
  console.log("OK");
})().catch((e) => { console.error(e); process.exit(1); });
