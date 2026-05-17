/**
 * ComplexBenchmarkSuite: Simulating real-world WebFast scenarios
 */
import { describe, it, beforeAll } from 'vitest';
import { Q } from '../../src/index';
import { performance } from 'perf_hooks';

describe('Complex WebFast Benchmarks', () => {
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

    it('benchmarks nested component rendering and list updates', () => {
        const app = Q("#app");

        // 1. Nested Component Tree (Depth 5)
        benchmark("Nested tree (depth 5, 32 elements)", 100, () => {
            app[0].innerHTML = "";
            let root = app.el("div.root");
            for (let i = 0; i < 5; i++) {
                root = root.el("div.nested-" + i);
            }
        });

        // 2. Large List Update (1000 items)
        const listContainer = app.el("ul.list");
        benchmark("List update (1000 items)", 10, () => {
            listContainer[0].innerHTML = "";
            for (let i = 0; i < 1000; i++) {
                listContainer.el("li").text("Item " + i);
            }
        });
    });
});
