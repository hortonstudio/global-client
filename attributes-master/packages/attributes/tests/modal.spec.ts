import { expect, test } from '@playwright/test';

import { waitAttributeLoaded } from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('http://fs-attributes.webflow.io/modal');
});

test.describe('modal', () => {
  test('Modal opens + settings work', async ({ page }) => {
    await waitAttributeLoaded(page, 'modal');

    const modal1 = page.locator('[fs-modal-element="modal-1"]');
    const modal5 = page.locator('[fs-modal-element="modal-5"]');
    const openTrigger1 = page.locator('[fs-modal-element="open-1"]');
    const openTrigger5 = page.locator('[fs-modal-element="open-5"]');
    const closeTrigger1 = page.locator('[fs-modal-element="close-1"]');

    // Opens
    await openTrigger1.first().click();
    await page.waitForTimeout(300);
    await expect(modal1).toHaveCSS('display', 'flex');

    // Closes
    await closeTrigger1.nth(1).click({ force: true });
    await page.waitForTimeout(300);
    await expect(modal1).toHaveCSS('display', 'none');

    // Opens with custom display property
    await openTrigger5.first().click();
    await page.waitForTimeout(300);
    await expect(modal5).toHaveCSS('display', 'block');
  });
});
