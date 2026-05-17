# WebFast Learning Path: From Zero to Atomic

Welcome to WebFast. This path is designed to take you from a blank slate to a professional frontend developer without the "black box" magic of modern frameworks.

---

## 🏔 Philosophy: No Magic
In WebFast, everything is **explicit**.
- You see the DOM.
- You see the state.
- You control the data.

---

## 🚀 Level 1: The Atomic Cursor (Core)
Understand how we interact with the web browser directly.
- **The Cursor (`Q`)**: Think of `Q` as your pointer in the DOM tree.
- **The Creator (`el`)**: Everything is created and added using `el()`.

**Tutorial**: Create a "Hello World" app.
1. `Q("#app")` - Where to work.
2. `.el("h1").text("Hello")` - Creating and setting text.

---

## ⚡ Level 2: Reactive Nerve System (State)
Learn how to keep your UI in sync with your data.
- **`Q.state(v)`**: A simple Proxy object.
- **`bind()`**: Linking a state to a DOM element.

**Tutorial**: Create a counter that updates automatically.
```javascript
const count = Q.state(0);
Q("#app").el("p").bind(count, v => `Count: ${v}`, 'text');
Q("#app").el("btn").on("click", () => count.value++);
```

---

## 🧱 Level 3: Identity Manipulation (Atomic Identity)
Learn to change the structure of your elements without full re-renders.
- **`add()` / `rm()` / `set()`**: Manipulate classes and IDs using CSS-like syntax.

**Tutorial**: Build a theme switcher that adds/removes a `.dark` class.

---

## ✨ Level 4: The Soul (WebFast FX)
Bring your UI to life with emotions, not just layout.
- **`fx()`**: Asynchronous transitions/animations.
- **`wait()`**: Precise timing control.

**Tutorial**: Create a list where new items slide in, and items delete with a shrink animation.

---

## 🛣 Level 5: The Spine & The Data (Rooting & Base)
Architect professional, multi-page applications with persistence.
- **`RootingFast`**: Create a multi-page app without hydration magic.
- **`BaseFast`**: Save data as real files using OPFS.

**Tutorial**: Build the SNS Application.
1. Route between Feed and Profile.
2. Save posts to the "disk" (OPFS).
3. Query them using SQL-like syntax.

---

## 🎓 Next Steps
You are now ready to build anything. The code is yours. The control is yours.
- **Build**: `npm run build:all`
- **Docs**: `仕様書.md` (The source of truth)
