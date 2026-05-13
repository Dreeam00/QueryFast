export class QCollection extends Array<Element> {
  constructor(items: Element[] = []) {
    super(...items);
    Object.setPrototypeOf(this, QCollection.prototype);
  }

  appendTo(target: string | Node | QCollection): this {
    let parent: Node | null = null;
    if (typeof target === 'string') {
      parent = document.querySelector(target);
    } else if (target instanceof Node) {
      parent = target;
    } else if (Array.isArray(target) && target[0] instanceof Node) {
      parent = target[0];
    }

    if (parent && typeof parent.appendChild === 'function') {
      this.forEach(el => (parent as Node).appendChild(el));
    }
    return this;
  }

  content(value?: string): string | this {
    if (value === undefined) {
      return this[0]?.textContent || '';
    }
    this.forEach(el => {
      el.textContent = value;
    });
    return this;
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
          this.content(result);
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

Q.add = (selector: string): QCollection => {
  // Simple CSS-like parser: tag#id.class1.class2
  const match = selector.match(/^([a-z0-9-]+)?(?:#([a-z0-9-]+))?((?:\.[a-z0-9-]+)*)$/i);
  if (!match) return new QCollection();

  const [, tag, id, classes] = match;
  const el = document.createElement(tag || 'div');
  if (id) el.id = id;
  if (classes) {
    classes.split('.').filter(Boolean).forEach(c => el.classList.add(c));
  }
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

const components: Record<string, (props?: any) => QCollection> = {};

Q.component = (name: string, factory: (props?: any) => QCollection) => {
  components[name] = factory;
};

Q.use = (name: string, props?: any): QCollection => {
  const factory = components[name];
  if (!factory) return new QCollection();
  return factory(props);
};

Q.mount = (name: string, target: string | Node): QCollection => {
  const collection = Q.use(name);
  collection.appendTo(target);
  return collection;
};

// Global export for static usage
if (typeof window !== 'undefined') {
  (window as any).Q = Q;
}
