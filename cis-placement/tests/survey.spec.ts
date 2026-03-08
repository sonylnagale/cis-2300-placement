import { test, expect } from '@playwright/test';

test.describe.serial('Survey flow', () => {
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
        console.log(noDiv2)
        await expect(noDiv2).toBeVisible({ timeout: 5000 });
        await noDiv2.click();

        const nextbtn = page.locator('input.sd-btn[value="Next"]');
        await expect(nextbtn).toBeVisible({ timeout: 5000 });
        await nextbtn.click();

        const sectionA = page.locator('div.sd-title:has-text("Placement Section A")');
        await expect(sectionA).toBeVisible({ timeout: 5000 });

        const nextbtn2 = page.locator('input.sd-btn[value="Next"]');
        await expect(nextbtn2).toBeVisible({ timeout: 5000 });
        await nextbtn2.click();

        const completeText = page.locator('div.sd-body:has-text("Contact CIS")');
        await expect(completeText).toBeVisible({ timeout: 5000 });

    });
});
