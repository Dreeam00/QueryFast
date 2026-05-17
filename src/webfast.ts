/**
 * WebFast v3.0: The Unified Entry Point.
 */

import { Q, QCollection } from './index';
import { RootingFast } from './rooting';
import { BaseFast } from './base';
import { FX } from './fx';

const WebFast = {
  Q,
  QCollection,
  Router: RootingFast,
  DB: BaseFast,
  FX
};

if (typeof window !== 'undefined') {
  (window as any).WebFast = WebFast;
  // Keep legacy globals for transition
  (window as any).Q = Q;
  (window as any).RootingFast = RootingFast;
  (window as any).BaseFast = BaseFast;
  (window as any).FX = FX;
}

export { Q, QCollection, RootingFast as Router, BaseFast as DB, FX };
export default WebFast;
