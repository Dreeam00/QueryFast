# 🚀 QueryFast v2.0

**「Q は DOM カーソルであり、el は DOM を生む唯一の構文である。」**

QueryFast は、超軽量・高速・直観的な DOM 操作ライブラリです。
仮想 DOM を使わず、ブラウザのネイティブ機能を最大限に活かした「最小・最速」の UI 開発体験を提供します。

## 🌟 特徴

- ⚡ **Zero Overhead**: 仮想 DOM なし。直接 DOM を操作するため、極めて高速です。
- 🧱 **DOM Cursor Philosophy**: `Q` は常に DOM を指すカーソル。迷うことなく操作できます。
- 🏗 **Single Syntax**: `el()` だけで要素生成もコンポーネント呼び出しも完結します。
- ⚛️ **Atomic Identity**: `add()`, `rm()`, `set()` でクラスや ID を自在に操作。
- ✨ **Emotional UI**: `.fx()` メソッドで JS 定義のアニメーションを atomic に実行。
- 🔄 **Simple Reactive**: 組み込みの状態管理で、値の変化を即座に UI に反映。
- 📦 **Ultra Light**: 依存関係ゼロ、**1.5KB gzipped** の極小エンジン。

## 🛠 インストール

```bash
npm install queryfast
```

## 🚀 クイックスタート (v2.0)

```javascript
import { Q } from 'queryfast';

// 1. Q で DOM カーソルを取得
const app = Q("#app");

// 2. el() で要素を生成して append
const counter = app.el("div.counter");

// 3. リアクティブな状態
const count = Q.state(0);

// 4. コンポーネントの定義
function countDisplay(parent, state) {
  return parent.el("p")
    .bind(state, v => `Count: ${v}`, 'text');
}

// 5. コンポーネントの呼び出しとイベント
counter.el(countDisplay, count);
counter.el("btn#inc").text("+").on("click", () => count.value++);
```

## 📖 API マニュアル

詳細なドキュメントは [仕様書.md](./仕様書.md) を参照してください。

## 📜 ライセンス

ISC
