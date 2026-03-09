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
});
