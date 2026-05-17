/**
 * ComponentTestSuite: Verifying individual minified components
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Component Verification', () => {
    let dom, window;

    beforeAll(() => {
        dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', { runScripts: "dangerously" });
        window = dom.window;
        global.window = window;
        global.document = window.document;
    });

    const components = [
        { name: 'queryfast.min.js', global: 'Q' },
        { name: 'rootingfast.min.js', global: 'RootingFast' },
        { name: 'fx.min.js', global: 'FX' },
        { name: 'basefast.min.js', global: 'BaseFast' }
    ];

    components.forEach(comp => {
        it(`loads and exposes ${comp.name} correctly`, () => {
            const code = fs.readFileSync(path.join(__dirname, '../../dist', comp.name), 'utf8');
            const script = window.document.createElement('script');
            script.textContent = code;
            window.document.head.appendChild(script);

            const exported = window[comp.global];
            expect(exported, `${comp.name} did not expose ${comp.global}`).toBeDefined();
            console.log(`✅ ${comp.name} loaded and exposed ${comp.global}`);
        });
    });
});
