import { test, expect } from '@playwright/test';

test.describe.serial('Flow No Experience', () => {
    let context;
    let page;

    test.beforeAll(async ({ browser }) => {

        context = await browser.newContext();
        page = await context.newPage();
        await page.goto('/');
        await page.waitForSelector('.survey');
    });

    test.afterAll(async () => {
        await context.close();
    });

    test('Survey renders', async () => {
        const sdRoot = page.locator('.sd-root-modern');
        await expect(sdRoot).toBeVisible({ timeout: 5000 });
    });

    test('navigates to next page when Next clicked', async () => {
        const nextBtn = page.locator('input.sd-btn[value="Next"]');
        await expect(nextBtn).toBeVisible({ timeout: 5000 });

        await nextBtn.click();

        const nextBtn2 = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn2).toBeVisible({ timeout: 5000 });
        await nextBtn2.click();
    });

    test('Goes to No Experience and Completes', async () => {
        // Find the label with class sd-boolean that contains a span with text 'No'
        const noDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').nth(0);
        await expect(noDiv).toBeVisible({ timeout: 5000 });
        await noDiv.click();

        await page.waitForTimeout(500);

        const noDiv2 = page.locator('label.sd-boolean .sv-string-viewer:has-text("No")').nth(2);
        await expect(noDiv2).toBeVisible({ timeout: 5000 });
        await noDiv2.click();

        const nextbtn = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextbtn).toBeVisible({ timeout: 5000 });
        await nextbtn.click();

        const completeText = page.locator('h1[data-placement="No Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        const nextbtn2 = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextbtn2).toBeVisible({ timeout: 5000 });
        await nextbtn2.click();

        const h1 = page.locator('div.sd-body.sd-completedpage h1');
        await expect(h1).toBeVisible({ timeout: 5000 });
    });
});

test.describe.serial('Flow Limited Experience', () => {
    let context;
    let page;

    test.beforeAll(async ({ browser }) => {

        context = await browser.newContext();
        page = await context.newPage();
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

        const nextBtn3 = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn3).toBeVisible({ timeout: 5000 });
        await nextBtn3.click();
    });

    test.afterAll(async () => {
        await context.close();
    });

    test('Goes to Limited Experience and Completes', async () => {
        // Find the label with class sd-boolean that contains a span with text 'No'
        const yesDiv = page.locator('label.sd-boolean .sv-string-viewer:has-text("Yes")').nth(0);
        await expect(yesDiv).toBeVisible({ timeout: 5000 });
        await yesDiv.click();

        await page.waitForTimeout(500);

        const ap = page.locator('div.sd-item:has-text("Computer Science A") span').nth(0);
        await expect(ap).toBeVisible({ timeout: 5000 });
        await ap.click();

        const apScore = page.locator('div.sd-item:has-text("1") span').nth(0);
        await expect(apScore).toBeVisible({ timeout: 5000 });
        await apScore.click();

        const nextBtn2 = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextBtn2).toBeVisible({ timeout: 5000 });
        await nextBtn2.click();

        const completeText = page.locator('h1[data-placement="Limited Experience"]');
        await expect(completeText).toBeVisible({ timeout: 5000 });

        const nextbtn2 = page.locator('input.sd-btn[value="Next"]').last();
        await expect(nextbtn2).toBeVisible({ timeout: 5000 });
        await nextbtn2.click();

        const h1 = page.locator('div.sd-body.sd-completedpage h1');
        await expect(h1).toBeVisible({ timeout: 5000 });

    });
});
