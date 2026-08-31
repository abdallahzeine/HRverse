import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, join, extname } from 'node:path';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const slideDir = resolve('slides');
const pdfDir = resolve('pdfs');
const imageDir = resolve('images');
mkdirSync(pdfDir, { recursive: true });
mkdirSync(imageDir, { recursive: true });

const slideFiles = Array.from({ length: 8 }, (_, i) => `slide-${String(i + 1).padStart(2, '0')}.html`);
const root = resolve('.');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.pdf': 'application/pdf' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const filePath = resolve(root, `.${pathname}`);
    if (!filePath.startsWith(root)) throw new Error('bad path');
    res.setHeader('content-type', mime[extname(filePath)] || 'application/octet-stream');
    res.end(await readFile(filePath));
  } catch {
    res.statusCode = 404;
    res.end('not found');
  }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
await page.emulateMedia({ media: 'screen' });

const report = [];

for (const file of slideFiles) {
  const url = `${baseUrl}/slides/${file}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.grid')).display === 'grid', null, { timeout: 15000 });
  await page.waitForTimeout(300);

  const issues = await page.evaluate(() => {
    const slide = document.querySelector('.slide');
    const slideRect = slide.getBoundingClientRect();
    const visible = (el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) !== 0 && r.width > 1 && r.height > 1;
    };

    const overflow = [];
    for (const el of slide.querySelectorAll('*')) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom > slideRect.bottom + 1 || r.right > slideRect.right + 1 || r.left < slideRect.left - 1 || r.top < slideRect.top - 1) {
        overflow.push({
          tag: el.tagName,
          className: String(el.className || '').slice(0, 90),
          text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90),
          rect: { x: r.x, y: r.y, w: r.width, h: r.height }
        });
      }
    }

    const boxes = [];
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        const el = node.parentElement;
        if (!el || !visible(el)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const el = node.parentElement;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (r.width > 2 && r.height > 2) {
          boxes.push({
            el,
            tag: el.tagName,
            className: String(el.className || '').slice(0, 70),
            text: node.textContent.trim().replace(/\s+/g, ' ').slice(0, 50),
            rect: { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }
          });
        }
      }
      range.detach();
    }

    const overlaps = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        if (a.el === b.el) continue;
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const w = Math.min(a.rect.r, b.rect.r) - Math.max(a.rect.l, b.rect.l);
        const h = Math.min(a.rect.b, b.rect.b) - Math.max(a.rect.t, b.rect.t);
        if (w > 3 && h > Math.min(a.rect.h, b.rect.h) * 0.45) {
          overlaps.push({ a: { text: a.text, tag: a.tag, className: a.className }, b: { text: b.text, tag: b.tag, className: b.className }, overlap: { w, h } });
        }
      }
    }

    return { overflowCount: overflow.length, overflow: overflow.slice(0, 12), textOverlapCount: overlaps.length, textOverlaps: overlaps.slice(0, 12) };
  });

  report.push({ file, ...issues });

  await page.screenshot({ path: join(imageDir, file.replace('.html', '.png')), type: 'png' });
  await page.pdf({
    path: join(pdfDir, file.replace('.html', '.pdf')),
    width: '13.333in',
    height: '7.5in',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
}

await browser.close();
server.close();

const merged = await PDFDocument.create();
for (const file of slideFiles) {
  const pdf = await PDFDocument.load(readFileSync(join(pdfDir, file.replace('.html', '.pdf'))));
  const pages = await merged.copyPages(pdf, pdf.getPageIndices());
  pages.forEach((p) => merged.addPage(p));
}
writeFileSync(join(pdfDir, 'HRVERSE-complete-deck.pdf'), await merged.save());
writeFileSync(join(imageDir, 'verification-report.json'), `${JSON.stringify(report, null, 2)}\n`);

const bad = report.filter((item) => item.overflowCount || item.textOverlapCount);
console.log(`Rendered ${slideFiles.length} individual HTML files to PDFs, generated PNG checks, then merged PDFs.`);
console.log(`Images: images/slide-01.png … images/slide-08.png`);
console.log(`Report: images/verification-report.json`);
if (bad.length) {
  console.error(`Verification found possible layout issues in: ${bad.map((item) => item.file).join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('Verification passed: no viewport overflow or detected text overlap.');
}
