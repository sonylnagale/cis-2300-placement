import { test, expect } from '@playwright/test';

import { defineConfig } from '@playwright/test';

test.describe.parallel('Experience Flow', () => {
    let context;
    let page;
    let screenshots = false;

    test.beforeAll(async ({ browser }) => {

        context = await browser.newContext();
        page = await context.newPage();

        if (!browser["_options"].headless) {
            page.on('console', msg => {
                console.log('Browser console log:', msg.text());
            });
        }

        if (process.env.SCREENSHOTS) {
            screenshots = true;
        }

        await page.goto('/');
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

    test.afterAll(async () => {
        await context.close();
    });

    test('No Experience', async () => {
        let step = 1;
        // no course
        let noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        // no AP/IB
        noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }

        let nextbtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextbtn).toBeVisible({ timeout: 5000 });
        await nextbtn.click();

        step++;
        // no experience
        noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }

        nextbtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextbtn).toBeVisible({ timeout: 5000 });
        await nextbtn.click();

        step++;

        const completeText = page.locator('h1[data-placement="No Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }

        nextbtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextbtn).toBeVisible({ timeout: 5000 });
        await nextbtn.click();

        step++;

        nextbtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextbtn).toBeVisible({ timeout: 5000 });
        await nextbtn.click();

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Limited Experience AP', async () => {
        let step = 1;
        // yes course
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        // yes AP/IB
        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();


        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }
        step++;

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const ap = page.locator('div.sd-item:has-text("Computer Science A") span').last();
        await expect(ap).toBeVisible({ timeout: 5000 });
        await ap.click();

        const apScore = page.locator('div.sd-item:has-text("1") span').last();
        await expect(apScore).toBeVisible({ timeout: 5000 });
        await apScore.click();

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }
        step++;

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // no experience
        let noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }
        step++;

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }

        step++;

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();


        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Limited Experience IB', async () => {
        let step = 1;
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }

        step++;

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const ap = page.locator('div.sd-item:has-text("Standard Level") span').last();
        await expect(ap).toBeVisible({ timeout: 5000 });
        await ap.click();

        const apScore = page.locator('div.sd-item:has-text("1") span').last();
        await expect(apScore).toBeVisible({ timeout: 5000 });
        await apScore.click();

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }

        step++;

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // no experience
        let noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();
        
        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }
        
        step++;

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }
        
        step++;

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        if (screenshots) {
            await page.screenshot({ path: `./tests/screenshots/${test.info().title}-${step}.png`, fullPage: true });
        }
        
        step++;
        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Limited Experience Concepts', async () => {
        // Find the label with class sd-boolean that contains a span with text 'No'
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // experience
        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        for (let i = 0; i < 4; i++) {
            const noButton = page.locator('div.sd-item:has-text("I have never heard of this") span').nth(i);
            await expect(noButton).toBeVisible({ timeout: 5000 });
            await noButton.click();
        }

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const completeText = page.locator('h1[data-placement="Needs Refresher"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Good Experience Concepts Limited Examples', async () => {
        // no course
        let noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        // no AP/IB
        noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // experience
        noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        for (let i = 0; i < 7; i++) {
            let noButton = page.locator('div.sd-item:has-text("I am somewhat comfortable using this in programming.") span.sv-string-viewer').nth(i);
            await noButton.click();
        }

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const nextText = page.locator('.sd-page:has-text("Code Assessment")');
        await expect(nextText).toBeVisible({ timeout: 5000 });

        let wrongAnswer = page.locator('div.sd-item.sd-radio span.sv-string-viewer').nth(1);
        await wrongAnswer.click();

        let comfort = page.locator('div.sd-item:has-text("I was able to complete the problem but struggled greatly.") span.sv-string-viewer').last();
        await expect(comfort).toBeVisible({ timeout: 5000 });
        await comfort.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const completeText = page.locator('h1[data-placement="Needs Refresher"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();


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

        const nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();
    }

    // ── Helper: step through all 6 code pages answering every question correctly ─
    async function answerAllCodePagesCorrectly() {
        // correct answer positions (0-based) after the model changes:
        // conditionals: [a, CORRECT(2), b]           → index 1
        // for loop:     [c, CORRECT(2), d]            → index 1
        // while loop:   [CORRECT(2), e, f]            → index 0
        // dictionaries: [g, CORRECT(2), h]            → index 1
        // return values:[CORRECT(2), i, j]            → index 0
        // advanced:     [k, l, CORRECT(2)]            → index 2
        const correctIndices = [1, 1, 0, 1, 0, 2];
        for (const idx of correctIndices) {
            await answerCodePage(idx, 4);
        }
    }

    test('Limited Experience - Course Only', async () => {
        // no AP/IB
        let noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        // yes previous course
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // no experience
        noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Limited Experience - Experience Only', async () => {
        // no AP/IB
        let noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        // no previous course
        noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // yes experience
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Needs Refresher - High Background, All Topics Unknown', async () => {
        // no AP/IB
        let noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        // yes previous course
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // yes experience → preliminary_state = 2
        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        // all 8 topics rated "I have never heard of this" → concepts_state avg = 0 < 3 → Refresher
        for (let i = 0; i < 8; i++) {
            const neverHeard = page.locator('div.sd-item:has-text("I have never heard of this") span.sv-string-viewer').nth(i);
            await expect(neverHeard).toBeVisible({ timeout: 5000 });
            await neverHeard.click();
        }

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const completeText = page.locator('h1[data-placement="Needs Refresher"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Needs Refresher - High Background, Mixed Low Concepts', async () => {
        // no AP/IB
        let noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        // yes previous course
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // yes experience → preliminary_state = 2
        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        // first 4 topics "I have heard of this but don't understand it" (value 1)
        // last 4 topics "somewhat comfortable" (value 3) → avg = (4 + 12) / 8 = 2.0 < 3 → Refresher
        for (let i = 0; i < 4; i++) {
            const heard = page.locator('div.sd-item:has-text("I have heard of this but don\'t know what it is") span.sv-string-viewer').nth(i);
            await expect(heard).toBeVisible({ timeout: 5000 });
            await heard.click();
        }
        for (let i = 0; i < 4; i++) {
            const somewhat = page.locator('div.sd-item:has-text("I am somewhat comfortable using this in programming.") span.sv-string-viewer').nth(i);
            await expect(somewhat).toBeVisible({ timeout: 5000 });
            await somewhat.click();
        }

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const completeText = page.locator('h1[data-placement="Needs Refresher"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Advanced - Course and Experience, Good Concepts, All Correct', async () => {
        // no AP/IB
        let noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').last();
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        // yes previous course
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // yes experience → preliminary_state = 2
        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        // all 8 topics "entirely comfortable" (value 4) → concepts_state avg = 4 ≥ 3 → Code Assessment
        for (let i = 0; i < 8; i++) {
            const entirely = page.locator('div.sd-item:has-text("I am entirely comfortable using this in programming.") span.sv-string-viewer').nth(i);
            await expect(entirely).toBeVisible({ timeout: 5000 });
            await entirely.click();
        }

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const codeTitle = page.locator('.sd-page:has-text("Code Assessment")');
        await expect(codeTitle).toBeVisible({ timeout: 5000 });

        await answerAllCodePagesCorrectly();

        const completeText = page.locator('h1[data-placement="Good Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Advanced - AP High Score, Good Concepts, All Correct', async () => {
        // yes AP/IB course
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        // yes previous course
        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // select AP CS A
        const ap = page.locator('div.sd-item:has-text("Computer Science A") span').last();
        await expect(ap).toBeVisible({ timeout: 5000 });
        await ap.click();

        // score of 5 → AP score (> 3) adds +2 to preliminary_state
        const apScore = page.locator('div.sd-item:has-text("5") span').last();
        await expect(apScore).toBeVisible({ timeout: 5000 });
        await apScore.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // yes experience → preliminary_state = 1(AP) + 2(score>3) + 1(course) + 1(experience) = 5 → topics visible
        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        // all 8 topics "entirely comfortable" → concepts_state = 4 ≥ 3 → Code Assessment
        for (let i = 0; i < 8; i++) {
            const entirely = page.locator('div.sd-item:has-text("I am entirely comfortable using this in programming.") span.sv-string-viewer').nth(i);
            await expect(entirely).toBeVisible({ timeout: 5000 });
            await entirely.click();
        }

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const codeTitle = page.locator('.sd-page:has-text("Code Assessment")');
        await expect(codeTitle).toBeVisible({ timeout: 5000 });

        await answerAllCodePagesCorrectly();

        const completeText = page.locator('h1[data-placement="Good Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });

    test('Advanced - AP High Score, Good Concepts, Partial Correct (threshold)', async () => {
        // yes AP/IB course
        let yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        // yes previous course
        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        let nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // select IB HL
        const ibHL = page.locator('div.sd-item:has-text("High Level") span').last();
        await expect(ibHL).toBeVisible({ timeout: 5000 });
        await ibHL.click();

        // IB score 5 (> 3) → +2 to preliminary_state
        const ibScore = page.locator('div.sd-item:has-text("5") span').last();
        await expect(ibScore).toBeVisible({ timeout: 5000 });
        await ibScore.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        // yes experience → preliminary_state ≥ 2 → topics visible
        yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').last();
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const title = page.locator('div.sd-title:has-text("Topics and Constructs")');
        await expect(title).toBeVisible({ timeout: 5000 });

        // all 8 topics "entirely comfortable" → concepts_state = 4 → Code Assessment shows
        for (let i = 0; i < 8; i++) {
            const entirely = page.locator('div.sd-item:has-text("I am entirely comfortable using this in programming.") span.sv-string-viewer').nth(i);
            await expect(entirely).toBeVisible({ timeout: 5000 });
            await entirely.click();
        }

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const codeTitle = page.locator('.sd-page:has-text("Code Assessment")');
        await expect(codeTitle).toBeVisible({ timeout: 5000 });

        // Answer 4 of 6 correctly (examples_state = 8, exactly at threshold) with a "little difficulty" reaction
        // correctIndices = [1, 1, 0, 1, 0, 2] — answer first 4 correctly, last 2 wrong
        const correctIndices = [1, 1, 0, 1];
        const wrongIndices = [0, 0]; // wrong answer for return values and advanced

        for (const idx of correctIndices) {
            await answerCodePage(idx, 3); // "a little difficulty"
        }
        for (const idx of wrongIndices) {
            await answerCodePage(idx, 1); // "began but got stuck"
        }

        const completeText = page.locator('h1[data-placement="Good Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        nextBtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        nextBtn = page.locator('input.sd-btn[value="Complete"]').last();
        await expect(nextBtn).toBeVisible({ timeout: 5000 });
        await nextBtn.click();

        const fin = page.locator('div.sd-body.sd-completedpage');
        await expect(fin).toBeVisible({ timeout: 5000 });
    });
});
