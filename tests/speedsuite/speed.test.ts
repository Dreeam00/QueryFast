/**
 * SpeedTestSuite: Benchmarking Core WebFast Operations
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { Q } from '../../src/index';
import { performance } from 'perf_hooks';

describe('WebFast Performance Benchmarks', () => {
    beforeAll(() => {
        // Setup DOM
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

    it('benchmarks core operations', () => {
        console.log("--- Starting WebFast Benchmarks ---");

        // 1. Benchmark Node Creation
        benchmark("Node creation (Q.add)", 1000, () => {
            Q.add("div.test-node");
        });

        // 2. Benchmark DOM Append
        const app = Q("#app");
        benchmark("DOM appending", 1000, () => {
            const node = Q.add("div.test-node");
            app[0].appendChild(node[0]);
        });

        // 3. Benchmark Text Updates
        const testNode = Q.add("div.test-node-update");
        app[0].appendChild(testNode[0]);
        benchmark("Text update", 1000, () => {
            testNode.text("updated");
        });

        console.log("--- Benchmarks Complete ---");
    });
});
