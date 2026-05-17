import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
    console.log('🚀 Starting WebFast v3.0 PDF generation...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const filePath = 'file://' + path.resolve(__dirname, '../docs/index.html');
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    await page.evaluate(() => {
        // Show all documentation sections for the PDF
        document.querySelectorAll('.doc-section').forEach(s => s.style.display = 'block');
        // Hide UI elements
        const selectorsToHide = ['nav', 'footer', '.btn-lab'];
        selectorsToHide.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.style.display = 'none';
        });
    });

    await page.addStyleTag({ content: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Fira+Code:wght@400;500&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif !important; color: #111 !important; background: #fff !important; font-size: 11pt; }
        h1 { font-size: 56pt !important; color: #0070f3 !important; margin-top: 100pt !important; }
        h2 { font-size: 32pt !important; border-bottom: 4pt solid #0070f3 !important; margin-top: 40pt !important; page-break-before: always; }
        .pillar-grid { display: block !important; }
        .pillar-card { border: 1px solid #eee !important; margin: 10pt 0 !important; page-break-inside: avoid; }
        pre, code { background: #111 !important; color: #fff !important; border-radius: 8pt !important; padding: 10pt !important; font-size: 9pt !important; }
        .api-table { border: 1px solid #eee !important; }
    `});

    const pdfPath = 'docs/WebFast-Official-Docs.pdf';
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 8pt; width: 100%; text-align: center; color: #999;">WebFast v3.0 — Official technical Reference</div>',
        footerTemplate: '<div style="font-size: 8pt; width: 100%; text-align: center; color: #999;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    });

    await browser.close();
    console.log(`✅ WebFast PDF generated at ${pdfPath}`);
}

generatePDF();
