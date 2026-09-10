import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the home page is keyboard operable and free of detectable violations', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/\S/)

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()

  await page.getByRole('textbox', { name: 'Your name' }).fill('Ada')
  await page.getByRole('button', { name: 'Greet' }).click()
  await expect(page.getByRole('status')).toHaveText('Hello, Ada.')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()

  expect(results.violations).toEqual([])
  expect(
    results.incomplete,
    'axe-core incomplete results require manual verification',
  ).toEqual([])
})
