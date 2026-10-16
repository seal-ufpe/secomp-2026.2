import { expect, test } from '@playwright/test';

const projects = [
  {
    _id: '1',
    title: 'App Recife',
    authorName: 'Ana',
    origin: 'lovable',
    url: 'https://app.vercel.app',
    host: 'app.vercel.app',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Agenda',
    authorName: 'Bruno',
    origin: 'base44',
    url: 'https://agenda.vercel.app',
    host: 'agenda.vercel.app',
    createdAt: new Date().toISOString(),
  },
];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/projects/stream', (route) =>
    route.fulfill({ status: 200, contentType: 'text/event-stream', body: ': connected\n\n' }),
  );
  await page.route('**/api/projects', async (route) => {
    if (route.request().method() === 'GET') await route.fulfill({ json: { items: projects } });
    else await route.continue();
  });
});

test('filters the gallery by text and origin', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'App Recife' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Agenda' })).toBeVisible();
  await page.getByPlaceholder('Buscar por título ou autor').fill('recife');
  await expect(page.getByRole('heading', { name: 'App Recife' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Agenda' })).not.toBeVisible();
});

test('submits a project and stores the one-time edit token', async ({ page }) => {
  await page.route('**/api/projects', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        json: { editToken: 'one-time-token', project: projects[0] },
      });
    } else {
      await route.fulfill({ json: { items: projects } });
    }
  });
  await page.goto('/cadastrar');
  await page.getByLabel('Título').fill('Novo projeto');
  await page.getByLabel('Seu nome').fill('Carla');
  await page.getByLabel('Link Vercel').fill('https://novo.vercel.app');
  await page.getByLabel('Código do minicurso').fill('TEST');
  await page.getByRole('button', { name: 'Publicar projeto' }).click();
  await expect(page.getByText('Projeto cadastrado!')).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem('editToken'))).resolves.toBe(
    'one-time-token',
  );
});
