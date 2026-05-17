export class QCollection extends Array<Element> {
  constructor(i: Element[] = []) {
    super(...i);
    Object.setPrototypeOf(this, QCollection.prototype);
  }

  get parent() { return this[0] }

  el(a: any, ...args: any[]): any {
    if (typeof a === 'string') {
      const n = Q.add(a);
      this[0]?.appendChild(n[0]);
      return n;
    }
    return a(this, ...args);
  }

  add(s: string) {
    const { id, classes } = p(s);
    return this.forEach(el => {
      if (id) el.id = id;
      classes.forEach(c => el.classList.add(c));
    }) || this;
  }

  rm(s: string) {
    const { id, classes } = p(s);
    return this.forEach(el => {
      if (id && el.id === id) el.id = '';
      classes.forEach(c => el.classList.remove(c));
    }) || this;
  }

  set(s: string) {
    const { id, classes } = p(s);
    return this.forEach(el => {
      if (id) el.id = id;
      el.className = classes.join(' ');
    }) || this;
  }

  fx(a: any, o?: any): Promise<this> {
    const el = this[0];
    if (!el) return Promise.resolve(this);
    if (typeof a === 'object') {
      return new Promise(r => el.animate(a, o || { duration: 300, fill: 'forwards' }).onfinish = () => r(this));
    }
    this.add(a);
    return new Promise(r => {
      const f = (e: any) => { if (e.target === el) { el.removeEventListener('transitionend', f); el.removeEventListener('animationend', f); r(this); } };
      el.addEventListener('transitionend', f);
      el.addEventListener('animationend', f);
      if (parseFloat(getComputedStyle(el).transitionDuration) === 0) setTimeout(() => r(this), 20);
    });
  }

  wait(ms: number): Promise<this> { return new Promise(r => setTimeout(() => r(this), ms)); }

  text(v?: string): any {
    if (v === undefined) return this[0]?.textContent || '';
    return this.forEach(e => e.textContent = v) || this;
  }

  appendTo(t: any) {
    const p = typeof t === 'string' ? document.querySelector(t) : (t[0] || t);
    return this.forEach(e => p?.appendChild(e)) || this;
  }

  html(v?: string): any {
    if (v === undefined) return this[0]?.innerHTML || '';
    return this.forEach(e => e.innerHTML = v) || this;
  }

  attr(n: string, v?: any): any {
    if (arguments.length === 1) return this[0]?.getAttribute(n);
    return this.forEach(e => (v == null || v === false) ? e.removeAttribute(n) : e.setAttribute(n, v)) || this;
  }

  on(t: string, h: any) {
    return this.forEach(e => {
      if (t === 'hover') {
        e.addEventListener('mouseenter', ev => h(e, true, ev));
        e.addEventListener('mouseleave', ev => h(e, false, ev));
      } else e.addEventListener(t, ev => h(e, ev));
    }) || this;
  }

  ui(s: any) {
    const kMap: any = { bg: 'background', text: 'color' };
    return this.forEach((e: any) => {
      for (const k in s) e.style[kMap[k] || k] = s[k];
    }) || this;
  }

  bind(s: any, m: any, mode: string) {
    const f = (v: any) => {
      const r = m(v);
      if (mode === 'text') this.text(r);
      else if (mode === 'html') this.html(r);
      else if (mode === 'attr') for (const k in r) this.attr(k, r[k]);
      else if (mode === 'class') for (const k in r) this.forEach(e => r[k] ? e.classList.add(k) : e.classList.remove(k));
      else if (mode === 'css') this.ui(r);
    };
    s._subscribe(f);
    return this;
  }
}

export function Q(s: any): QCollection {
  if (s instanceof QCollection) return s;
  const i = typeof s === 'string' ? Array.from(document.querySelectorAll(s)) : (Array.isArray(s) ? s : [s]);
  return new QCollection(i.filter(Boolean) as Element[]);
}

const pCache = new Map<string, { tag: string, id: string, classes: string[] }>();

const p = (s: string) => {
  if (pCache.has(s)) return pCache.get(s)!;
  const m = s.match(/^([a-z0-9-]+)?(?:#([a-z0-9-]+))?((?:\.[a-z0-9-]+)*)$/i) || [];
  const parsed = { tag: m[1] || '', id: m[2] || '', classes: m[3] ? m[3].split('.').filter(Boolean) : [] };
  pCache.set(s, parsed);
  return parsed;
};

const tMap: any = { sec: 'section', hdr: 'header', btn: 'button', art: 'article', spn: 'span', inp: 'input' };

Q.add = (s: string) => {
  const { tag, id, classes } = p(s);
  const e = document.createElement(tMap[tag] || tag || 'div');
  if (id) e.id = id;
  classes.forEach(c => e.classList.add(c));
  return new QCollection([e]);
};

Q.state = (v: any) => {
  let subs: any[] = [];
  const o = { 
    value: v, 
    _subscribe(f: any) { subs.push(f); f(this.value); },
    _unsubscribe(f: any) { subs = subs.filter(s => s !== f); }
  };
  return new Proxy(o, {
    set(t, p, v) {
      if (p === 'value') { t.value = v; for (let i = 0; i < subs.length; i++) subs[i](v); }
      else (t as any)[p] = v;
      return true;
    }
  });
};

Q.global = (css: string) => {
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
};

if (typeof window !== 'undefined') {
  (window as any).Q = Q;
  (window as any).QCollection = QCollection;
}
