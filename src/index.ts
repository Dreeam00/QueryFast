export class QCollection extends Array<Element> {
  constructor(items: Element[] = []) {
    super(...items);
    Object.setPrototypeOf(this, QCollection.prototype);
  }

  /**
   * DOM Cursor / Selector mapping
   */
  get parent(): Element | null {
    return this[0] || null;
  }

  /**
   * el("emmet") -> Create and append DOM
   * el(fn, ...args) -> Call component
   */
  el(arg: string | ((parent: QCollection, ...args: any[]) => any), ...args: any[]): any {
    if (typeof arg === 'string') {
      const newCol = Q.add(arg);
      newCol.appendTo(this);
      return newCol;
    } else if (typeof arg === 'function') {
      return arg(this, ...args);
    }
    return this;
  }

  /**
   * v2.1.0: Add classes or ID
   * Example: .add(".active.blue") or .add("#new-id")
   */
  add(selector: string): this {
    const { id, classes } = parseSelector(selector);
    this.forEach(el => {
      if (id) el.id = id;
      classes.forEach(c => el.classList.add(c));
    });
    return this;
  }

  /**
   * v2.1.0: Remove classes or ID
   * Example: .rm(".active") or .rm("#old-id")
   */
  rm(selector: string): this {
    const { id, classes } = parseSelector(selector);
    this.forEach(el => {
      if (id && el.id === id) el.id = '';
      classes.forEach(c => el.classList.remove(c));
    });
    return this;
  }

  /**
   * v2.1.0: Set classes or ID (Overwrite)
   * Example: .set("#only-this.one-class")
   */
  set(selector: string): this {
    const { id, classes } = parseSelector(selector);
    this.forEach(el => {
      if (id) el.id = id;
      el.className = classes.join(' ');
    });
    return this;
  }

  /**
   * Set or get text content
   */
  text(value?: string): string | this {
    if (value === undefined) {
      return this[0]?.textContent || '';
    }
    this.forEach(el => {
      el.textContent = value;
    });
    return this;
  }

  appendTo(target: string | Node | QCollection): this {
    let parent: Node | null = null;
    if (typeof target === 'string') {
      parent = document.querySelector(target);
    } else if (target instanceof Node) {
      parent = target;
    } else if (target instanceof QCollection) {
      parent = target[0];
    }

    if (parent && typeof parent.appendChild === 'function') {
      this.forEach(el => (parent as Node).appendChild(el));
    }
    return this;
  }

  content(value?: string): string | this {
    return this.text(value);
  }

  html(value?: string): string | this {
    if (value === undefined) {
      return this[0]?.innerHTML || '';
    }
    this.forEach(el => {
      el.innerHTML = value;
    });
    return this;
  }

  attr(name: string, value?: string | null | false | undefined): string | null | this {
    if (arguments.length === 1) {
      return this[0]?.getAttribute(name) ?? null;
    }
    this.forEach(el => {
      if (value === null || value === false || value === undefined) {
        el.removeAttribute(name);
      } else {
        el.setAttribute(name, value);
      }
    });
    return this;
  }

  on(type: string, handler: (el: Element, eventOrActive: any, event?: Event) => void): this {
    this.forEach(el => {
      if (type === 'hover') {
        el.addEventListener('mouseenter', (e) => handler(el, true, e));
        el.addEventListener('mouseleave', (e) => handler(el, false, e));
      } else {
        el.addEventListener(type, (e) => handler(el, e));
      }
    });
    return this;
  }

  ui(styleObj: Record<string, string>): this {
    const keyMap: Record<string, string> = {
      bg: 'background',
      text: 'color'
    };
    this.forEach(el => {
      const htmlEl = el as HTMLElement;
      for (const [key, val] of Object.entries(styleObj)) {
        const styleKey = keyMap[key] || key;
        (htmlEl.style as any)[styleKey] = val;
      }
    });
    return this;
  }

  bind(state: any, mapFn: (val: any) => any, mode: 'text' | 'html' | 'attr' | 'class' | 'css'): this {
    state._subscribe((val: any) => {
      const result = mapFn(val);
      switch (mode) {
        case 'text':
          this.text(result);
          break;
        case 'html':
          this.html(result);
          break;
        case 'attr':
          for (const [name, attrVal] of Object.entries(result)) {
            this.attr(name, attrVal as any);
          }
          break;
        case 'class':
          for (const [className, isEnabled] of Object.entries(result)) {
            this.forEach(el => {
              if (isEnabled) el.classList.add(className);
              else el.classList.remove(className);
            });
          }
          break;
        case 'css':
          this.ui(result);
          break;
      }
    });
    return this;
  }
}

export function Q(selector: string | Node | Node[] | QCollection): QCollection {
  if (selector instanceof QCollection) {
    return selector;
  }
  if (typeof selector === 'string') {
    return new QCollection(Array.from(document.querySelectorAll(selector)));
  }
  if (selector instanceof Node) {
    return new QCollection([selector as Element]);
  }
  if (Array.isArray(selector)) {
    return new QCollection(selector as Element[]);
  }
  return new QCollection();
}

/**
 * Common Selector Parser
 */
function parseSelector(selector: string) {
  const match = selector.match(/^([a-z0-9-]+)?(?:#([a-z0-9-]+))?((?:\.[a-z0-9-]+)*)$/i);
  if (!match) return { tag: '', id: '', classes: [] };
  const [, tag, id, classesStr] = match;
  const classes = classesStr ? classesStr.split('.').filter(Boolean) : [];
  return { tag: tag || '', id: id || '', classes };
}

/**
 * Emmet-like shorthand mapping
 */
const tagMap: Record<string, string> = {
  sec: 'section',
  hdr: 'header',
  btn: 'button',
  art: 'article',
  nav: 'nav',
  ftr: 'footer',
  inp: 'input',
  txt: 'textarea',
  lbl: 'label',
  img: 'img',
  spn: 'span',
  div: 'div',
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  ul: 'ul',
  li: 'li'
};

Q.add = (selector: string): QCollection => {
  const { tag, id, classes } = parseSelector(selector);
  const realTag = tagMap[tag] || tag || 'div';
  
  const el = document.createElement(realTag);
  if (id) el.id = id;
  classes.forEach(c => el.classList.add(c));
  return new QCollection([el]);
};

Q.state = (initial: any) => {
  const subscribers: Function[] = [];
  const stateObj = {
    value: initial,
    _subscribe(fn: Function) {
      subscribers.push(fn);
      fn(this.value);
    }
  };

  const proxy = new Proxy(stateObj, {
    set(target, prop, value) {
      if (prop === 'value') {
        target.value = value;
        subscribers.forEach(fn => fn(value));
        return true;
      }
      (target as any)[prop] = value;
      return true;
    }
  });

  return proxy;
};

// Global export for static usage
if (typeof window !== 'undefined') {
  (window as any).Q = Q;
}
