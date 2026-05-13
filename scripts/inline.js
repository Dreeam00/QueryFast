import fs from 'fs';
import path from 'path';

const htmlPath = 'index.html';
const jsPath = 'dist/queryfast.min.js';
const outputPath = 'dist/index.portable.html';

try {
    let html = fs.readFileSync(htmlPath, 'utf8');
    const js = fs.readFileSync(jsPath, 'utf8');

    // <script src="./dist/queryfast.min.js"></script> を <script>中身</script> に置換
    const scriptTagPattern = /<script src="\.\/dist\/queryfast\.min\.js"><\/script>/;
    
    if (scriptTagPattern.test(html)) {
        const inlinedHtml = html.replace(scriptTagPattern, `<script>\n${js}\n</script>`);
        
        if (!fs.existsSync('dist')) fs.mkdirSync('dist');
        fs.writeFileSync(outputPath, inlinedHtml);
        
        console.log(`✅ Success: Portable HTML generated at ${outputPath}`);
    } else {
        console.error('❌ Error: Could not find the script tag in index.html');
    }
} catch (err) {
    console.error('❌ Error:', err.message);
}
