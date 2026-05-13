# 📘 QueryFast

A tiny, fast, and reactive DOM manipulation library. No dependencies. Perfect for small tools and portable HTML applications.

## Features

- 🚀 **Lightweight**: Zero dependencies, tiny footprint (~2.5KB).
- ⚡ **Fast**: Direct DOM manipulation without virtual DOM overhead.
- 🔄 **Reactive**: Simple built-in state management.
- 🧩 **Component-based**: Organize your UI into reusable parts.
- 📦 **Portable**: Easily inline into a single HTML file.

## Installation

```bash
npm install queryfast
```

## Quick Start (Modern)

```javascript
import { Q } from 'queryfast';

const count = Q.state(0);

Q.add('button')
  .content('Click me')
  .on('click', () => count.value++)
  .appendTo('body');

Q.add('p')
  .bind(count, v => `Count: ${v}`, 'text')
  .appendTo('body');
```

## Static Usage (Script Tag)

```html
<script src="https://unpkg.com/queryfast/dist/queryfast.min.js"></script>
<script>
  const { Q } = window.QueryFast;
  // ... your code
</script>
```

## License

ISC
