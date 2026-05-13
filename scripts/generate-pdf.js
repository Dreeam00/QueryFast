import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
    console.log('🚀 Starting official PDF generation...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const filePath = 'file://' + path.resolve(__dirname, '../docs/index.html');
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    // Inject script to show ALL sections for the PDF
    await page.evaluate(() => {
        document.querySelectorAll('.section').forEach(s => s.style.display = 'block');
        const nav = document.querySelector('nav');
        if (nav) nav.style.display = 'none';
        const footer = document.querySelector('footer');
        if (footer) footer.style.display = 'none';
    });

    // Intensify PDF Styling
    await page.addStyleTag({ content: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { 
            font-family: 'Inter', sans-serif; 
            color: #000 !important; 
            background: #fff !important; 
            padding: 0;
            font-size: 12pt;
        }
        .container { max-width: 100% !important; margin: 0 !important; padding: 20mm !important; }
        h1 { font-size: 48pt !important; font-weight: 900 !important; color: #0070f3 !important; margin-bottom: 30pt !important; }
        h2 { font-size: 28pt !important; border-bottom: 3pt solid #0070f3 !important; padding-bottom: 10pt !important; margin-top: 50pt !important; }
        h3 { font-size: 20pt !important; color: #0070f3 !important; margin-top: 30pt !important; }
        pre { 
            background: #f8f9fa !important; 
            border: 1pt solid #dee2e6 !important; 
            padding: 15pt !important; 
            border-radius: 8pt !important;
            font-size: 10pt !important;
            white-space: pre-wrap !important;
        }
        .method-card { 
            background: #fff !important; 
            color: #000 !important; 
            border: 1pt solid #eee !important; 
            padding: 20pt !important; 
            margin: 20pt 0 !important;
            page-break-inside: avoid;
        }
        .method-name { color: #d63384 !important; font-weight: bold !important; font-size: 14pt !important; }
        .grid { display: block !important; }
        .example-box { display: none !important; }
        .section { page-break-after: always; }
    `});

    await page.pdf({
        path: 'dist/QueryFast-Documentation.pdf',
        format: 'A4',
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 9px; width: 100%; text-align: center; border-bottom: 0.5pt solid #eee; padding-bottom: 5pt;">QueryFast Official Documentation — v1.0.0</div>',
        footerTemplate: '<div style="font-size: 9px; width: 100%; text-align: center; border-top: 0.5pt solid #eee; padding-top: 5pt;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    });

    await browser.close();
    console.log('✅ Official PDF generated at dist/QueryFast-Documentation.pdf');
}

generatePDF();
