/**
 * DebugSuite: Logic verification for WebFast Ecosystem
 */
import { Q } from '../../src/index';
import { RootingFast } from '../../src/rooting';

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        process.exit(1);
    }
    console.log(`✅ PASSED: ${message}`);
}

// 1. Verify Core
console.log("--- Testing Core ---");
const div = document.createElement('div');
div.id = 'app';
document.body.appendChild(div);
assert(Q('#app').length === 1, "Q cursor can find #app");

// 2. Verify Router
console.log("--- Testing Router ---");
RootingFast.route({
    "/test": async () => console.log("Route matched")
});
assert(true, "Router initialized without crash");

console.log("DebugSuite: All checks passed.");
