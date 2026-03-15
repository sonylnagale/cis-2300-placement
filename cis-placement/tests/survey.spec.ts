import { test, expect, Page, Browser } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Viewports
// ─────────────────────────────────────────────────────────────────────────────
const VIEWPORTS = {
    mobile: { width: 390, height: 844 },   // iPhone 14 Pro
    tablet: { width: 768, height: 1024 },  // iPad
    desktop: { width: 1280, height: 720 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers  (all accept `page` so they work across describe blocks)
// ─────────────────────────────────────────────────────────────────────────────
async function screenshot(page: Page, label: string, step: number) {
    if (process.env.SCREENSHOTS) {
        await page.screenshot({
            path: `./tests/screenshots/${label}-${step}.png`,
            // fullPage: true,
        });
    }
}

async function clickNext(page: Page) {
    const btn = page.locator('input.sd-btn[value="Next"]').last();
    await expect(btn).toBeVisible({ timeout: 5000 });
    await btn.click();
}

async function clickComplete(page: Page) {
    const btn = page.locator('input.sd-btn[value="Complete"]').last();
    await expect(btn).toBeVisible({ timeout: 5000 });
    await btn.click();
}

async function clickBoolean(page: Page, value: 'Yes' | 'No') {
    const div = page.locator(`.sd-boolean .sv-string-viewer:has-text("${value}")`).last();
    await expect(div).toBeVisible({ timeout: 10000 });
    await div.click();
}

async function answerCodePage(page: Page, correctIndex: number, reactionIndex = 4) {
    const answer = page.locator('div.sd-item.sd-radio span.sv-string-viewer').nth(correctIndex);
    await expect(answer).toBeVisible({ timeout: 5000 });
    await answer.click();

    const reaction = page.locator('div.sd-item.sd-radio span.sv-string-viewer').nth(3 + reactionIndex);
    await expect(reaction).toBeVisible({ timeout: 5000 });
    await reaction.click();

    await clickNext(page);
}

/** Scoring: conditionals:1=1, for-loop:1=2, while-loop:0=2,
 *  dictionaries:1=1, return:1=1, advanced:1=1 → total 8 */
async function answerAllCodePagesCorrectly(page: Page) {
    const correctIndices = [1, 1, 0, 1, 1, 1];
    for (const idx of correctIndices) {
        await answerCodePage(page, idx, 4);
    }
}

/** Navigate past Introduction and Background — same for every test. */
async function gotoAndStart(browser: Browser, viewport: { width: number; height: number }) {

    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    await page.goto('/cis-2300-placement');
    await page.waitForSelector('.survey');

    const sdRoot = page.locator('.sd-root-modern');
    await expect(sdRoot).toBeVisible({ timeout: 5000 });

    // Introduction
    const nextBtn = page.locator('input.sd-btn[value="Next"]');
    await expect(nextBtn).toBeVisible({ timeout: 5000 });
    await nextBtn.click();

    // Background
    const nextBtn2 = page.locator('input.sd-btn[value="Next"]').last();
    await expect(nextBtn2).toBeVisible({ timeout: 5000 });
    await nextBtn2.click();

    return { context, page };
}

// ─────────────────────────────────────────────────────────────────────────────
// Test suite factory — runs all flow tests at a given viewport
// ─────────────────────────────────────────────────────────────────────────────
function describeSurveyTests(label: string, viewport: { width: number; height: number }) {
    test.describe.parallel(`Experience Flow [${label}]`, () => {
        let context;
        let page: Page;

        test.beforeEach(async ({ browser }) => {
            ({ context, page } = await gotoAndStart(browser, viewport));
        });

        test.afterEach(async () => {
            await context.close();
        });

        const shot = (step: number) => screenshot(page, `${label}-${test.info().title}`, step);

        // ── No Experience ────────────────────────────────────────────────────
        test('No Experience', async () => {
            let step = 1;

            await clickBoolean(page, 'No');
            await shot(step++);
            await clickNext(page);

            await clickBoolean(page, 'No');
            await shot(step++);
            await clickNext(page);

            await clickBoolean(page, 'No');
            await shot(step++);
            await clickNext(page);

            const result = page.locator('h1[data-placement="No Experience"]');
            await expect(result).toBeVisible({ timeout: 5000 });
            await shot(step++);

            await clickComplete(page);
            await shot(step++);

            const fin = page.locator('div.sd-body.sd-completedpage');
            await expect(fin).toBeVisible({ timeout: 5000 });
        });

        // ── Limited Experience: AP ───────────────────────────────────────────
        test('Limited Experience AP', async () => {
            let step = 1;

            await clickBoolean(page, 'Yes');

            const ap = page.locator('div.sd-item:has-text("Computer Science A") span').last();
            await expect(ap).toBeVisible({ timeout: 5000 });
            await ap.click();

            const apScore = page.locator('div.sd-item:has-text("1") span').last();
            await expect(apScore).toBeVisible({ timeout: 5000 });
            await apScore.click();

            await shot(step++);
            await clickNext(page);

            await clickBoolean(page, 'No');
            await shot(step++);
            await clickNext(page);

            await clickBoolean(page, 'No');
            await shot(step++);
            await clickNext(page);

            const result = page.locator('h1[data-placement="Limited Experience"]');
            await expect(result).toBeVisible({ timeout: 5000 });
            await shot(step++);

            await clickComplete(page);

            const fin = page.locator('div.sd-body.sd-completedpage');
            await expect(fin).toBeVisible({ timeout: 5000 });
        });

        // ── Limited Experience: IB ───────────────────────────────────────────
        test('Limited Experience IB', async () => {
            let step = 1;

            await clickBoolean(page, 'Yes');

            const ib = page.locator('div.sd-item:has-text("SL") span').last();
            await expect(ib).toBeVisible({ timeout: 5000 });
            await ib.click();

            const ibScore = page.locator('div.sd-item:has-text("1") span').last();
            await expect(ibScore).toBeVisible({ timeout: 5000 });
            await ibScore.click();

            await shot(step++);
            await clickNext(page);

            await clickBoolean(page, 'No');
            await shot(step++);
            await clickNext(page);

            await clickBoolean(page, 'No');
            await shot(step++);
            await clickNext(page);

            const result = page.locator('h1[data-placement="Limited Experience"]');
            await expect(result).toBeVisible({ timeout: 5000 });
            await shot(step++);

            await clickComplete(page);
            await shot(step++);
        });

        // ── Limited Experience: Concepts only ────────────────────────────────
        test('Limited Experience Concepts', async () => {
            await clickBoolean(page, 'No');
            await clickNext(page);

            await clickBoolean(page, 'No');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
            await expect(title).toBeVisible({ timeout: 5000 });

            for (let i = 0; i < 4; i++) {
                const btn = page.locator('div.sd-item:has-text("I have never heard of this") span').nth(i);
                await expect(btn).toBeVisible({ timeout: 5000 });
                await btn.click();
            }

            await clickNext(page);

            const result = page.locator('h1[data-placement="Limited Experience"]');
            await expect(result).toBeVisible({ timeout: 5000 });

            await clickComplete(page);

            const fin = page.locator('div.sd-body.sd-completedpage');
            await expect(fin).toBeVisible({ timeout: 5000 });
        });

        // ── Limited Experience: Course only, Low Concepts ────────────────────
        test('Limited Experience - Course Only, Low Concepts', async () => {
            await clickBoolean(page, 'No');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            await clickBoolean(page, 'No');
            await clickNext(page);

            const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
            await expect(title).toBeVisible({ timeout: 5000 });

            for (let i = 0; i < 8; i++) {
                const btn = page.locator('div.sd-item:has-text("I have never heard of this") span.sv-string-viewer').nth(i);
                await expect(btn).toBeVisible({ timeout: 5000 });
                await btn.click();
            }

            await clickNext(page);

            const result = page.locator('h1[data-placement="Limited Experience"]');
            await expect(result).toBeVisible({ timeout: 5000 });

            await clickComplete(page);

            const fin = page.locator('div.sd-body.sd-completedpage');
            await expect(fin).toBeVisible({ timeout: 5000 });
        });

        // ── Needs Refresher: Experience only, Low Concepts ───────────────────
        test('Needs Refresher - Experience Only, Low Concepts', async () => {
            await clickBoolean(page, 'No');
            await clickNext(page);

            await clickBoolean(page, 'No');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
            await expect(title).toBeVisible({ timeout: 5000 });

            for (let i = 0; i < 8; i++) {
                const btn = page.locator('div.sd-item:has-text("I have never heard of this") span.sv-string-viewer').nth(i);
                await expect(btn).toBeVisible({ timeout: 5000 });
                await btn.click();
            }

            await clickNext(page);

            const result = page.locator('h1[data-placement="Limited Experience"]');
            await expect(result).toBeVisible({ timeout: 5000 });

            await clickComplete(page);

            const fin = page.locator('div.sd-body.sd-completedpage');
            await expect(fin).toBeVisible({ timeout: 5000 });
        });

        // ── Needs Refresher: High Background, All Topics Unknown ─────────────
        test('Needs Refresher - High Background, All Topics Unknown', async () => {
            await clickBoolean(page, 'No');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
            await expect(title).toBeVisible({ timeout: 5000 });

            for (let i = 0; i < 8; i++) {
                const btn = page.locator('div.sd-item:has-text("I have never heard of this") span.sv-string-viewer').nth(i);
                await expect(btn).toBeVisible({ timeout: 5000 });
                await btn.click();
            }

            await clickNext(page);

            const result = page.locator('h1[data-placement="Needs Refresher"]');
            await expect(result).toBeVisible({ timeout: 5000 });

            await clickComplete(page);

            const fin = page.locator('div.sd-body.sd-completedpage');
            await expect(fin).toBeVisible({ timeout: 5000 });
        });

        // ── Needs Refresher: High Background, Mixed Low Concepts ─────────────
        test('Needs Refresher - High Background, Mixed Low Concepts', async () => {
            await clickBoolean(page, 'No');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
            await expect(title).toBeVisible({ timeout: 5000 });

            for (let i = 0; i < 8; i++) {
                const btn = page.locator('div.sd-item:has-text("I have heard of this but don\'t know what it is") span.sv-string-viewer').nth(i);
                await expect(btn).toBeVisible({ timeout: 5000 });
                await btn.click();
            }
            for (let i = 0; i < 5; i++) {
                const btn = page.locator('div.sd-item:has-text("I am somewhat comfortable using this in programming.") span.sv-string-viewer').nth(i);
                await expect(btn).toBeVisible({ timeout: 5000 });
                await btn.click();
            }

            await clickNext(page);

            const result = page.locator('h1[data-placement="Needs Refresher"]');
            await expect(result).toBeVisible({ timeout: 5000 });

            await clickComplete(page);

            const fin = page.locator('div.sd-body.sd-completedpage');
            await expect(fin).toBeVisible({ timeout: 5000 });
        });

        // ── Advanced: Course + Experience, All Correct ───────────────────────
        test('Advanced - Course and Experience, Good Concepts, All Correct', async () => {
            await clickBoolean(page, 'No');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
            await expect(title).toBeVisible({ timeout: 5000 });

            for (let i = 0; i < 8; i++) {
                const btn = page.locator('div.sd-item:has-text("I am entirely comfortable using this in programming.") span.sv-string-viewer').nth(i);
                await expect(btn).toBeVisible({ timeout: 5000 });
                await btn.click();
            }

            await clickNext(page);

            const codeTitle = page.locator('.sd-page:has-text("Code Assessment")');
            await expect(codeTitle).toBeVisible({ timeout: 5000 });

            await answerAllCodePagesCorrectly(page);

            const result = page.locator('h1[data-placement="Good Experience"]');
            await expect(result).toBeVisible({ timeout: 5000 });

            await clickComplete(page);

            const fin = page.locator('div.sd-body.sd-completedpage');
            await expect(fin).toBeVisible({ timeout: 5000 });
        });

        // ── Advanced: AP High Score, All Correct ─────────────────────────────
        test('Advanced - AP High Score, Good Concepts, All Correct', async () => {
            let step = 1;

            await clickBoolean(page, 'Yes');

            const ap = page.locator('div.sd-item:has-text("Computer Science A") span').last();
            await expect(ap).toBeVisible({ timeout: 5000 });
            await ap.click();

            const apScore = page.locator('div.sd-item:has-text("5") span').last();
            await expect(apScore).toBeVisible({ timeout: 5000 });
            await apScore.click();

            await shot(step++);
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            await clickBoolean(page, 'Yes');
            await clickNext(page);

            const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
            await expect(title).toBeVisible({ timeout: 5000 });

            for (let i = 0; i < 8; i++) {
                const btn = page.locator('div.sd-item:has-text("I am entirely comfortable using this in programming.") span.sv-string-viewer').nth(i);
                await expect(btn).toBeVisible({ timeout: 5000 });
                await btn.click();
            }

            await clickNext(page);

            const codeTitle = page.locator('.sd-page:has-text("Code Assessment")');
            await expect(codeTitle).toBeVisible({ timeout: 5000 });

            await answerAllCodePagesCorrectly(page);

            const result = page.locator('h1[data-placement="Good Experience"]');
            await expect(result).toBeVisible({ timeout: 5000 });

            await clickComplete(page);

            const fin = page.locator('div.sd-body.sd-completedpage');
            await expect(fin).toBeVisible({ timeout: 5000 });
        });
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Run the full suite at each form factor
// ─────────────────────────────────────────────────────────────────────────────
describeSurveyTests('mobile', VIEWPORTS.mobile);
describeSurveyTests('tablet', VIEWPORTS.tablet);
describeSurveyTests('desktop', VIEWPORTS.desktop);
