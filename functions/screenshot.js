const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

exports.handler = async (event) => {
  const query = event.queryStringParameters || {};
  const targetUrl = query.url;
  if (!targetUrl) {
    return { statusCode: 400, body: 'Missing "url" query parameter' };
  }
  const width = parseInt(query.width) || 1280;
  const height = parseInt(query.height) || 800;

  let browser = null;
  try {
    // Запуск headless Chrome (Chromium) с заданными опциями
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
      defaultViewport: { width, height },
      headless: chromium.headless
    });
    const page = await browser.newPage();
    // Переходим на целевую страницу объявления
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));  // небольшая пауза 1с для загрузки контента (если есть динамика)
    // Создаем скриншот всей страницы
    const screenshotBuffer = await page.screenshot({ type: 'png', fullPage: true });
    await browser.close();
    // Возвращаем изображение (PNG) в виде base64 для Netlify
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      body: screenshotBuffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    if (browser) await browser.close();
    console.error('Screenshot error:', error);
    return {
      statusCode: 500,
      body: 'Error taking screenshot: ' + error.message
    };
  }
};
