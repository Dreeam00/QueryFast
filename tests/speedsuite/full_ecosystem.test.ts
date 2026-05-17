/**
 * FullEcosystemBenchSuite: Benchmarking the entire WebFast Ecosystem
 */
import { describe, it, beforeAll } from 'vitest';
import { Q } from '../../src/index';
import { RootingFast } from '../../src/rooting';
import { FX } from '../../src/fx';
import { BaseFast } from '../../src/base';
import { performance } from 'perf_hooks';

describe('Full WebFast Ecosystem Benchmarks', () => {
    beforeAll(() => {
        const div = document.createElement('div');
        div.id = 'app';
        document.body.appendChild(div);
    });

    function benchmark(name, iterations, fn) {
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            fn();
        }
        const end = performance.now();
        const duration = (end - start).toFixed(2);
        console.log(`⏱️ ${name}: ${duration}ms (${iterations} iterations, ${(duration / iterations).toFixed(4)}ms/op)`);
    }

    it('benchmarks full ecosystem features', async () => {
        const app = Q("#app");

        // 1. Core Q
        benchmark("Core (Node creation)", 1000, () => Q.add("div"));

        // 2. Router
        benchmark("Router (Navigation simulation)", 100, () => {
            RootingFast.match("/test");
        });

        // 3. FX (Motion) - Skip animate() in Node/JSDOM
        console.log("⏱️ FX (Motion): Skipped in non-browser environment");

        // 4. BaseFast (Data manipulation)
        const db = BaseFast.from([{ id: 1 }, { id: 2 }, { id: 3 }]);
        benchmark("BaseFast (Select & Where)", 100, () => {
            db.select('id').where(i => i.id > 1).all();
        });
    });
});
