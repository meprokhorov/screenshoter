document.getElementById('preview-btn').onclick = () => {
  // Чтение файлов и вставка в карточку
  const reads = ['logo', 'main-img'].map(id => {
    const input = document.getElementById(id + '-input');
    const el = document.getElementById(id);
    return new Promise(res => {
      const reader = new FileReader();
      reader.onload = e => { el.src = e.target.result; res(); };
      reader.readAsDataURL(input.files[0]);
    });
  });
  Promise.all(reads).then(() => {
    document.getElementById('title').textContent = document.getElementById('title-input').value;
    document.getElementById('text').textContent = document.getElementById('text-input').value;
    document.getElementById('btn').textContent = document.getElementById('btn-input').value;
    document.getElementById('btn-text').textContent = document.getElementById('btn-text-input').value;
  });
};

// Скачивание скриншота через html2canvas  [oai_citation:4‡html2canvas.hertzen.com](https://html2canvas.hertzen.com/documentation.html?utm_source=chatgpt.com)
document.getElementById('download-btn').onclick = () => {
  html2canvas(document.getElementById('ad-card')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'ad_screenshot.png';
    link.href = canvas.toDataURL();
    link.click();
  });
};
