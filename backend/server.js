const express = require('express');
const multer = require('multer');
const puppeteer = require('puppeteer');

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
app.use(express.json());
app.use(express.static('../frontend'));

app.post('/api/screenshot', upload.fields([
  { name: 'logo' }, { name: 'main' }
]), async (req, res) => {
  // Подготовка HTML со вставленными данными (можно шаблонизатор)
  const html = `
    <html><body>
      <div id="card" style="width:500px;padding:16px;border:1px solid #ccc;">
        <img src="data:image/png;base64,${req.files.logo[0].buffer.toString('base64')}" />
        <h2>${req.body.title}</h2>
        <img src="data:image/png;base64,${req.files.main[0].buffer.toString('base64')}" />
        <p>${req.body.text}</p>
        <button style="background:#4680C2;color:#fff;border:none;padding:8px 12px;">
          ${req.body.btn}
        </button><span>${req.body.btnText}</span>
      </div>
    </body></html>`;
  
  const browser = await puppeteer.launch();  // запуск headless Chrome  [oai_citation:6‡pptr.dev](https://pptr.dev/guides/screenshots?utm_source=chatgpt.com)
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const element = await page.$('#card');
  const buffer = await element.screenshot();  // скриншот конкретного элемента  [oai_citation:7‡Stack Overflow](https://stackoverflow.com/questions/14595541/capture-div-into-image-using-html2canvas?utm_source=chatgpt.com)
  await browser.close();
  
  res.type('image/png').send(buffer);
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
