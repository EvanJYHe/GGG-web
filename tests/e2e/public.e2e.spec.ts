import { expect, test } from '@playwright/test'

const baseUrl = process.env.PUBLIC_TEST_BASE_URL || 'http://localhost:3000'

test.describe('Public discovery resources', () => {
  test('renders meaningful homepage content without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText(/glazing/i)
    await expect(page.getByRole('heading', { name: 'WHAT WE DO' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /work together/i })).toBeVisible()

    const headings = await page.locator('h1, h2, h3').evaluateAll((elements) =>
      elements.map((element) => ({
        level: element.tagName,
        text: element.textContent?.replace(/\s+/g, ' ').trim(),
      })),
    )
    expect(headings[0]?.level).toBe('H1')
    expect(headings.filter(({ level }) => level === 'H1')).toHaveLength(1)
    expect((await page.locator('body').innerText()).length).toBeGreaterThan(500)

    await context.close()
  })

  test('does not expose removed Markdown or OpenAPI routes', async ({ request }) => {
    const markdownAccept = await request.get(baseUrl, {
      headers: { Accept: 'text/markdown' },
    })
    expect(markdownAccept.status()).toBe(200)
    expect(markdownAccept.headers()['content-type']).toContain('text/html')

    expect((await request.get(`${baseUrl}/index.md`)).status()).toBe(404)
    expect((await request.get(`${baseUrl}/games.md`)).status()).toBe(404)
    expect((await request.get(`${baseUrl}/openapi.json`)).status()).toBe(404)
  })

  test('returns a useful HTML 404 response', async ({ page }) => {
    const response = await page.goto(`${baseUrl}/agent-audit-path-that-does-not-exist`)
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: /lost in the jungle/i })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    await expect(page.getByRole('link', { name: 'Games' })).toHaveAttribute('href', '/games')
  })

  test('publishes metadata and structured identity without adding navigation pages', async ({ page, request }) => {
    await page.goto(baseUrl)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBeTruthy()
    expect(new URL(canonical || baseUrl).pathname).toBe('/')
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /opengraph-image/)

    const ogImage = new URL((await page.locator('meta[property="og:image"]').getAttribute('content')) || '', baseUrl)
    const ogImageResponse = await request.get(`${baseUrl}${ogImage.pathname}${ogImage.search}`)
    expect(ogImageResponse.status()).toBe(200)
    expect(ogImageResponse.headers()['content-type']).toContain('image/png')

    const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || '{}')
    expect(jsonLd['@type']).toBe('Organization')
    expect(jsonLd.name).toBe('Glazing Gorilla Games')
    expect(jsonLd.contactPoint.email).toBe('contact@glazinggorillas.com')
    await expect(page.getByRole('link', { name: 'Developers' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Privacy' })).toHaveCount(0)
  })

  test('publishes the retained discovery files', async ({ request }) => {
    const llms = await request.get(`${baseUrl}/llms.txt`)
    expect(llms.status()).toBe(200)
    const llmsBody = await llms.text()
    expect(llmsBody).toContain('When to use this site:')
    expect(llmsBody).toContain('/api/public/site-data')
    expect(llmsBody).not.toContain('openapi.json')
    expect(llmsBody).not.toContain('index.md')

    const sitemap = await request.get(`${baseUrl}/sitemap.xml`)
    expect(sitemap.status()).toBe(200)
    expect(sitemap.headers()['content-type']).toContain('application/xml')
    const sitemapBody = await sitemap.text()
    expect(sitemapBody).toContain('<loc>')
    expect(sitemapBody).toContain('/games')
    expect(sitemapBody).not.toContain('/developers')
    expect(sitemapBody).not.toContain('/privacy')
    expect((await request.get(`${baseUrl}/developers`)).status()).toBe(404)
    expect((await request.get(`${baseUrl}/privacy`)).status()).toBe(404)

    const robots = await request.get(`${baseUrl}/robots.txt`)
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Sitemap:')
    expect(await robots.text()).toContain('Allow: /api/public/site-data')
  })

  test('supports ETag revalidation on the public JSON contract', async ({ request }) => {
    const first = await request.get(`${baseUrl}/api/public/site-data`)
    expect(first.status()).toBe(200)
    const etag = first.headers().etag
    expect(etag).toBeTruthy()

    const conditional = await request.get(`${baseUrl}/api/public/site-data`, {
      headers: { 'If-None-Match': etag },
    })
    expect(conditional.status()).toBe(304)
    expect((await conditional.body()).length).toBe(0)
  })
})
