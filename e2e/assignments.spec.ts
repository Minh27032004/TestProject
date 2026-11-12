import { expect, test } from '@playwright/test';

const endpoint = '**/api/me/assignments';

test('real API renders exactly four assignments and the specified statuses', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const responsePromise = page.waitForResponse(
    (response) => response.url().endsWith('/api/me/assignments') && response.status() === 200,
  );
  await page.goto('/');
  const response = await responsePromise;
  const body = await response.text();
  expect(body).not.toContain('B01');
  expect(body).not.toContain('S02');
  await expect(page.getByRole('article')).toHaveCount(4);
  const reading = page.getByRole('article', { name: 'Foundation U1 – Reading' });
  const listening = page.getByRole('article', { name: 'Foundation U2 – Listening' });
  const writing = page.getByRole('article', { name: 'Foundation U3 – Writing' });
  const speaking = page.getByRole('article', { name: 'Foundation U4 – Speaking' });
  await expect(reading.getByText('Chưa nộp', { exact: true })).toBeVisible();
  await expect(listening.getByText('Quá hạn', { exact: true })).toBeVisible();
  await expect(writing.getByText('Đã nộp', { exact: true })).toBeVisible();
  await expect(writing.getByText('Nộp trễ', { exact: true })).toHaveCount(0);
  await expect(speaking.getByText('Đã nộp', { exact: true })).toBeVisible();
  await expect(speaking.getByText('Nộp trễ', { exact: true })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Tiến độ nộp bài' })).toHaveAttribute(
    'aria-valuenow',
    '50',
  );
  await expect(reading.getByText('13/11/2026', { exact: true })).toBeVisible();
  await expect(reading.locator('time')).toContainText('23:59');
  await expect(page.getByLabel('Thời điểm đối chiếu')).toContainText('11/11/2026 · 09:00 (GMT+7)');
  expect(errors).toEqual([]);
});

test('status filters show the right assignments and support keyboard activation', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  const overdue = page.getByRole('button', { name: /^Quá hạn/ });
  await overdue.focus();
  await page.keyboard.press('Enter');
  await expect(overdue).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article')).toHaveAccessibleName('Foundation U2 – Listening');
  await page.getByRole('button', { name: /^Đã nộp/ }).click();
  await expect(page.getByRole('article')).toHaveCount(2);
  await page.getByRole('button', { name: /^Chưa nộp/ }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article')).toHaveAccessibleName('Foundation U1 – Reading');
  await page.getByRole('button', { name: /^Tất cả/ }).click();
  await expect(page.getByRole('article')).toHaveCount(4);
});

test('loading is visible while an API request is pending', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(endpoint, async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Đang tải bài tập…' })).toBeVisible();
  release();
  await expect(page.getByRole('article')).toHaveCount(4);
});

test('server error can be retried successfully', async ({ page }) => {
  let fail = true;
  await page.route(endpoint, async (route) => {
    if (fail) await route.fulfill({ status: 500, json: { message: 'Service unavailable' } });
    else await route.continue();
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Chưa tải được bài tập');
  fail = false;
  await page.getByRole('button', { name: 'Thử lại' }).click();
  await expect(page.getByRole('article')).toHaveCount(4);
});

test('network failure shows an actionable error', async ({ page }) => {
  await page.route(endpoint, (route) => route.abort('failed'));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Chưa tải được bài tập');
  await expect(page.getByRole('button', { name: 'Thử lại' })).toBeVisible();
});

test('empty account has a helpful message and zero progress', async ({ page }) => {
  await page.route(endpoint, (route) =>
    route.fulfill({
      json: {
        student: { id: 'S01', name: 'Học viên S01' },
        referenceTime: '2026-11-11T09:00:00+07:00',
        items: [],
      },
    }),
  );
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Bạn chưa có bài tập nào' })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(page.getByRole('article')).toHaveCount(0);
});

test('empty filter can return to the complete list', async ({ page }) => {
  await page.route(endpoint, async (route) => {
    const response = await route.fetch();
    const body = await response.json();
    body.items = body.items.filter((item: { id: string }) => item.id === 'A01');
    await route.fulfill({ json: body });
  });
  await page.goto('/');
  await page.getByRole('button', { name: /^Đã nộp/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Không có bài tập ở trạng thái này' }),
  ).toBeVisible();
  await page.getByRole('button', { name: /Xem tất cả bài tập/ }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
});

test('layout fits narrow screens and produces a submission screenshot', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  if (testInfo.project.name === 'mobile') {
    await page.setViewportSize({ width: 320, height: 800 });
    await expect(page.getByRole('article').last()).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.setViewportSize({ width: 390, height: 844 });
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({
    path: `artifacts/assignments-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
