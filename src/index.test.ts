import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Q, QCollection } from './index';

describe('QueryFast v2.0', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  describe('Core Concepts', () => {
    it('Q(selector) should be a DOM cursor', () => {
      const app = Q('#app');
      expect(app).toBeInstanceOf(QCollection);
      expect(app[0].id).toBe('app');
    });

    it('el("emmet") should create and append DOM', () => {
      const app = Q('#app');
      const hero = app.el('sec.hero');
      expect(hero[0].tagName).toBe('SECTION');
      expect(hero[0].classList.contains('hero')).toBe(true);
      expect(app[0].contains(hero[0])).toBe(true);
    });

    it('el(fn, ...args) should call component with parent cursor', () => {
      const app = Q('#app');
      const mockComponent = vi.fn((parent, title) => {
        return parent.el('h1').text(title);
      });

      const result = app.el(mockComponent, 'Hello World');
      expect(mockComponent).toHaveBeenCalledWith(app, 'Hello World');
      expect(result[0].tagName).toBe('H1');
      expect(result.text()).toBe('Hello World');
    });
  });

  describe('User Example (v2.0 Draft)', () => {
    it('should work with the hero component example', () => {
      function hero(parent: any, title: string, sub: string) {
        const h = Q(parent).el("sec.hero")
        h.el("hdr.title").text(title)
        h.el("p.sub").text(sub)
        return h
      }

      const result = Q("#app").el(hero, "QueryFast", "Modern / Fast / Reactive / Light");

      const section = document.querySelector('section.hero');
      const header = section?.querySelector('header.title');
      const p = section?.querySelector('p.sub');

      expect(section).toBeTruthy();
      expect(header?.textContent).toBe('QueryFast');
      expect(p?.textContent).toBe('Modern / Fast / Reactive / Light');
      expect(result[0]).toBe(section);
    });
  });

  describe('Emmet Tag Mapping', () => {
    it('should map shorthand tags to full tags', () => {
      expect(Q.add('sec')[0].tagName).toBe('SECTION');
      expect(Q.add('hdr')[0].tagName).toBe('HEADER');
      expect(Q.add('btn')[0].tagName).toBe('BUTTON');
      expect(Q.add('ftr')[0].tagName).toBe('FOOTER');
      expect(Q.add('spn')[0].tagName).toBe('SPAN');
    });
  });

  describe('Backward Compatibility / Other methods', () => {
    it('text() and content() should be equivalent', () => {
      const q = Q.add('div');
      q.text('test');
      expect(q.content()).toBe('test');
      q.content('test2');
      expect(q.text()).toBe('test2');
    });

    it('bind with text', () => {
      const state = Q.state('initial');
      const q = Q.add('div');
      q.bind(state, (v) => v, 'text');
      expect(q.text()).toBe('initial');
      state.value = 'updated';
      expect(q.text()).toBe('updated');
    });
  });

  describe('v2.1.0 Atomic Methods', () => {
    it('add() should add classes and ID', () => {
      const q = Q.add('div');
      q.add('#my-id.class1.class2');
      expect(q[0].id).toBe('my-id');
      expect(q[0].classList.contains('class1')).toBe(true);
      expect(q[0].classList.contains('class2')).toBe(true);
    });

    it('rm() should remove classes and ID', () => {
      const q = Q.add('div#old-id.c1.c2');
      q.rm('#old-id.c1');
      expect(q[0].id).toBe('');
      expect(q[0].classList.contains('c1')).toBe(false);
      expect(q[0].classList.contains('c2')).toBe(true);
    });

    it('set() should overwrite identity', () => {
      const q = Q.add('div#old.old-class');
      q.set('#new.new-class');
      expect(q[0].id).toBe('new');
      expect(q[0].classList.contains('old-class')).toBe(false);
      expect(q[0].classList.contains('new-class')).toBe(true);
    });
  });
});
