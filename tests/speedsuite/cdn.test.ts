/**
 * CDNBenchSuite: Benchmarking Minified Bundles
 * Simulates loading the minified files in a browser-like environment (via JSDOM).
 */
import { describe, it, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

describe('CDN Bundle Performance Benchmarks', () => {
    let dom, window, Q;

    beforeAll(async () => {
        // Setup JSDOM
        dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', { runScripts: "dangerously", resources: "usable" });
        window = dom.window;
        global.window = window;
        global.document = window.document;

        // Load minified files
        const files = ['queryfast.min.js', 'webfast.min.js'];
        for (const file of files) {
            const code = fs.readFileSync(path.join(__dirname, '../../dist', file), 'utf8');
            const script = window.document.createElement('script');
            script.textContent = code;
            window.document.head.appendChild(script);
        }
        
        // Debug: Log what's available
        // console.log("Available globals:", Object.keys(window).filter(k => k.toLowerCase().includes('q') || k.toLowerCase().includes('webfast')));
        
        Q = window.Q;
    });

    function benchmark(name, iterations, fn) {
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            fn();
        }
        const end = performance.now();
        const duration = (end - start).toFixed(2);
        console.log(`⏱️ CDN ${name}: ${duration}ms (${iterations} iterations, ${(duration / iterations).toFixed(4)}ms/op)`);
    }

    it('benchmarks minified bundle operations', () => {
        if (!Q) { console.error("Q not found in CDN bundle"); return; }
        
        console.log("--- Starting CDN Bundle Benchmarks ---");

        benchmark("Node creation (Q.add)", 1000, () => {
            Q.add("div.cdn-test");
        });

        const app = Q("#app");
        benchmark("DOM appending", 1000, () => {
            const node = Q.add("div.cdn-test");
            app[0].appendChild(node[0]);
        });

        console.log("--- CDN Benchmarks Complete ---");
    });
});
