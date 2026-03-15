import { test, expect } from '@playwright/test';

import { defineConfig } from '@playwright/test';

test.describe.parallel('Experience Flow', () => {
    let context;
    let page;

    test.beforeEach(async ({ browser }) => {

        context = await browser.newContext();
        page = await context.newPage();

        if (!browser["_options"].headless) {
            page.on('console', msg => {
                console.log('Browser console log:', msg.text());
            });
        }

        await page.goto('/cis-2300-placement');
        await page.waitForSelector('.survey');

        const sdRoot = page.locator('.sd-root-modern');
        await expect(sdRoot).toBeVisible({ timeout: 5000 });

        const nextBtn = page.locator('input.sd-btn[value="Next"]');
        await expect(nextBtn).toBeVisible({ timeout: 5000 });

        await nextBtn.click();

        const nextBtn2 = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn2).toBeVisible({ timeout: 5000 });
        await nextBtn2.click();
    });

    test.afterEach(async () => {
        await context.close();
    });

    async function screenshot(step: number) {
        if (process.env.SCREENSHOTS) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }
    }

    async function clickNext() {
        const btn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(btn).toBeVisible({ timeout: 5000 });
        await btn.click();
    }

    async function clickComplete() {
        const btn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(btn).toBeVisible({ timeout: 5000 });
        await btn.click();
    }

    async function clickBoolean(value: 'Yes' | 'No') {
        const div = page.locator(`.sd-boolean .sv-string-viewer:has-text("${value}")`).last();
        await expect(div).toBeVisible({ timeout: 10000 });
        await div.click();
    }

    test('No Experience', async () => {
        let step = 1;

        // no AP/IB
        await clickBoolean('No');
        await screenshot(step);
        await clickNext();

        step++;

        // no prior course
        await clickBoolean('No');
        await screenshot(step);
        await clickNext();

        step++;

        // no experience
        await clickBoolean('No');
        await screenshot(step);

        await clickNext();

        step++;

        const completeText = page.locator('h1[data-placement="No Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        await screenshot(step);

        step++;

        await clickComplete();
        await screenshot(step);

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Limited Experience AP', async () => {
        let step = 1;

        // yes AP/IB
        await clickBoolean('Yes');

        const ap = page.locator('div.sd-item:has-text("Computer Science A") span').last();
        await expect(ap).toBeVisible({ timeout: 5000 });
        await ap.click();

        const apScore = page.locator('div.sd-item:has-text("1") span').last();
        await expect(apScore).toBeVisible({ timeout: 5000 });
        await apScore.click();

        await screenshot(step);

        step++;

        await clickNext();

        // no prior course
        await clickBoolean('No');
        await screenshot(step);

        await clickNext();

        // no experience
        await clickBoolean('No');
        await screenshot(step);

        step++;

        await clickNext();

        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        await screenshot(step);

        step++;

        await clickComplete();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Limited Experience IB', async () => {
        let step = 1;

        // yes AP/IB
        await clickBoolean('Yes');

        // IB standard level
        const ap = page.locator('div.sd-item:has-text("SL") span').last();
        await expect(ap).toBeVisible({ timeout: 5000 });
        await ap.click();

        const apScore = page.locator('div.sd-item:has-text("1") span').last();
        await expect(apScore).toBeVisible({ timeout: 5000 });
        await apScore.click();

        await screenshot(step);

        step++;

        await clickNext();

        // no prior course
        await clickBoolean('No');
        await screenshot(step);

        await clickNext();
        step++

        // no experience
        await clickBoolean('No');
        await screenshot(step);
        await clickNext();

        step++;
        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await screenshot(step);

        await expect(completeText).toBeVisible({ timeout: 5000 });

        step++;

        // const fin = page.locator('div.sd-body.sd-completedpage');
        // await expect(fin).toBeVisible({ timeout: 5000 });

        await clickComplete();
        await screenshot(step);
    });

    test('Limited Experience Concepts', async () => {
        // no AP/IB, no course
        await clickBoolean('No');
        await clickNext();

        // no prior course
        await clickBoolean('No');
        await clickNext();

        // experience
        await clickBoolean('Yes');
        await clickNext();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        for (let i = 0; i < 4; i++) {
            const noButton = page.locator('div.sd-item:has-text("I have never heard of this") span').nth(i);
            await expect(noButton).toBeVisible({ timeout: 5000 });
            await noButton.click();
        }

        await clickNext();

        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        await clickComplete();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });


    // ── Helper: answer one code assessment page (already navigated to it) ──────
    // correctIndex: 0-based index of the correct answer among the answer choices
    // reactionIndex: 0-based index of the reaction to select (4 = "no difficulty")
    async function answerCodePage(correctIndex: number, reactionIndex: number = 4) {
        const answer = page.locator('div.sd-item.sd-radio span.sv-string-viewer').nth(correctIndex);
        await expect(answer).toBeVisible({ timeout: 5000 });
        await answer.click();

        const reaction = page.locator('div.sd-item.sd-radio span.sv-string-viewer').nth(3 + reactionIndex);
        await expect(reaction).toBeVisible({ timeout: 5000 });
        await reaction.click();

        await clickNext();
    }

    // ── Helper: step through all 6 code pages answering every question correctly ─
    async function answerAllCodePagesCorrectly() {
        // Scoring map: conditionals:1=1, for-loop:1=2, while-loop:0=2,
        //              dictionaries:1=1, return:1=1, advanced:1=1  → total = 8
        // Index into the 3 answer choices on each page (0-based):
        const correctIndices = [1, 1, 0, 1, 1, 1];
        for (const idx of correctIndices) {
            await answerCodePage(idx, 4);
        }
    }

    test('Limited Experience - Course Only, Low Concepts', async () => {
        // No AP/IB + yes previous course → preliminary_state = 2 > 1 → Topics shows
        await clickBoolean('No');
        await clickNext();

        // yes previous course
        await clickBoolean('Yes');
        await clickNext();

        // no experience
        await clickBoolean('No');
        await clickNext();

        // Topics page shows — answer all 8 "never heard" → concepts_state = 0 → Refresher
        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        for (let i = 0; i < 8; i++) {
            const neverHeard = page.locator('div.sd-item:has-text("I have never heard of this") span.sv-string-viewer').nth(i);
            await expect(neverHeard).toBeVisible({ timeout: 5000 });
            await neverHeard.click();
        }

        await clickNext();

        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        await clickComplete();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Needs Refresher - Experience Only, Low Concepts', async () => {
        // No AP/IB + yes previous course → preliminary_state = 2 > 1 → Topics shows
        await clickBoolean('No');
        await clickNext();

        // no previous course
        await clickBoolean('No');
        await clickNext();

        // yes experience
        await clickBoolean('Yes');
        await clickNext();

        // Topics page shows — answer all 8 "never heard" → concepts_state = 0 → Refresher
        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        for (let i = 0; i < 8; i++) {
            const neverHeard = page.locator('div.sd-item:has-text("I have never heard of this") span.sv-string-viewer').nth(i);
            await expect(neverHeard).toBeVisible({ timeout: 5000 });
            await neverHeard.click();
        }

        await clickNext();

        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        await clickComplete();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Needs Refresher - High Background, All Topics Unknown', async () => {
        // no AP/IB
        await clickBoolean('No');
        await clickNext();

        // yes previous course
        await clickBoolean('Yes');
        await clickNext();

        // yes experience → preliminary_state = 2
        await clickBoolean('Yes');
        await clickNext();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        // all 8 topics rated "I have never heard of this" → concepts_state avg = 0 < 3 → Refresher
        for (let i = 0; i < 8; i++) {
            const neverHeard = page.locator('div.sd-item:has-text("I have never heard of this") span.sv-string-viewer').nth(i);
            await expect(neverHeard).toBeVisible({ timeout: 5000 });
            await neverHeard.click();
        }

        await clickNext();

        const completeText = page.locator('h1[data-placement="Needs Refresher"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        await clickComplete();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Needs Refresher - High Background, Mixed Low Concepts', async () => {
        // no AP/IB
        await clickBoolean('No');
        await clickNext();

        // yes previous course
        await clickBoolean('Yes');
        await clickNext();

        // yes experience → preliminary_state = 2
        await clickBoolean('Yes');
        await clickNext();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        // first 4 topics "I have heard of this but don't understand it" (value 1)
        // last 4 topics "somewhat comfortable" (value 3) → avg = (4 + 12) / 8 = 2.0 < 3 → Refresher
        for (let i = 0; i < 8; i++) {
            const heard = page.locator('div.sd-item:has-text("I have heard of this but don\'t know what it is") span.sv-string-viewer').nth(i);
            await expect(heard).toBeVisible({ timeout: 5000 });
            await heard.click();
        }
        for (let i = 0; i < 5; i++) {
            const somewhat = page.locator('div.sd-item:has-text("I am somewhat comfortable using this in programming.") span.sv-string-viewer').nth(i);
            await expect(somewhat).toBeVisible({ timeout: 5000 });
            await somewhat.click();
        }

        await clickNext();

        const completeText = page.locator('h1[data-placement="Needs Refresher"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        await clickComplete();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Advanced - Course and Experience, Good Concepts, All Correct', async () => {
        // no AP/IB
        await clickBoolean('No');
        await clickNext();

        // yes previous course
        await clickBoolean('Yes');
        await clickNext();

        // yes experience → preliminary_state = 2
        await clickBoolean('Yes');
        await clickNext();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        // all 8 topics "entirely comfortable" (value 4) → concepts_state avg = 4 ≥ 3 → Code Assessment
        for (let i = 0; i < 8; i++) {
            const entirely = page.locator('div.sd-item:has-text("I am entirely comfortable using this in programming.") span.sv-string-viewer').nth(i);
            await expect(entirely).toBeVisible({ timeout: 5000 });
            await entirely.click();
        }

        await clickNext();

        const codeTitle = page.locator('.sd-page:has-text("Code Assessment")');
        await expect(codeTitle).toBeVisible({ timeout: 5000 });

        await answerAllCodePagesCorrectly();

        const completeText = page.locator('h1[data-placement="Good Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        await clickComplete();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Advanced - AP High Score, Good Concepts, All Correct', async () => {
        let step = 1;
        // yes AP/IB course
        await clickBoolean('Yes');

        const ap = page.locator('div.sd-item:has-text("Computer Science A") span').last();
        await expect(ap).toBeVisible({ timeout: 5000 });
        await ap.click();

        const apScore = page.locator('div.sd-item:has-text("5") span').last();
        await expect(apScore).toBeVisible({ timeout: 5000 });
        await apScore.click();

        await screenshot(step);

        step++;

        await clickNext();

        // yes previous course
        await clickBoolean('Yes');

        await clickNext();

        // yes experience → preliminary_state = 1(AP) + 2(score>3) + 1(course) + 1(experience) = 5 → topics visible
        await clickBoolean('Yes');
        await clickNext();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        // all 8 topics "entirely comfortable" → concepts_state = 4 ≥ 3 → Code Assessment
        for (let i = 0; i < 8; i++) {
            const entirely = page.locator('div.sd-item:has-text("I am entirely comfortable using this in programming.") span.sv-string-viewer').nth(i);
            await expect(entirely).toBeVisible({ timeout: 5000 });
            await entirely.click();
        }

        await clickNext();

        const codeTitle = page.locator('.sd-page:has-text("Code Assessment")');
        await expect(codeTitle).toBeVisible({ timeout: 5000 });

        await answerAllCodePagesCorrectly();

        const completeText = page.locator('h1[data-placement="Good Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        await clickComplete();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });
});
