import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Q, QCollection } from './index';

describe('QueryFast', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Q function', () => {
    it('should select elements from string', () => {
      document.body.innerHTML = '<div class="test"></div><div class="test"></div>';
      const q = Q('.test');
      expect(q).toBeInstanceOf(QCollection);
      expect(q.length).toBe(2);
    });

    it('should wrap a Node', () => {
      const div = document.createElement('div');
      const q = Q(div);
      expect(q.length).toBe(1);
      expect(q[0]).toBe(div);
    });

    it('should wrap Node array', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const q = Q([div1, div2]);
      expect(q.length).toBe(2);
      expect(q[0]).toBe(div1);
    });

    it('should return empty collection for invalid input', () => {
      const q = Q(123 as any);
      expect(q.length).toBe(0);
    });
  });

  describe('Q.add', () => {
    it('should create element from selector', () => {
      const q = Q.add('div#myId.class1.class2');
      expect(q[0].tagName).toBe('DIV');
      expect(q[0].id).toBe('myId');
      expect(q[0].classList.contains('class1')).toBe(true);
      expect(q[0].classList.contains('class2')).toBe(true);
    });
  });

  describe('QCollection methods', () => {
    it('appendTo', () => {
      const container = document.createElement('div');
      container.id = 'container';
      document.body.appendChild(container);
      
      const q = Q.add('span').appendTo('#container');
      expect(container.firstChild).toBe(q[0]);
    });

    it('content', () => {
      const q = Q.add('div');
      q.content('hello');
      expect(q.content()).toBe('hello');
      expect(q[0].textContent).toBe('hello');
    });

    it('html', () => {
      const q = Q.add('div');
      q.html('<b>bold</b>');
      expect(q.html()).toBe('<b>bold</b>');
      expect(q[0].innerHTML).toBe('<b>bold</b>');
    });

    it('attr', () => {
      const q = Q.add('div');
      q.attr('data-test', 'value');
      expect(q.attr('data-test')).toBe('value');
      
      q.attr('data-test', null);
      expect(q.attr('data-test')).toBe(null);
    });

    it('on', () => {
      const q = Q.add('button');
      const handler = vi.fn();
      q.on('click', handler);
      q[0].dispatchEvent(new MouseEvent('click'));
      expect(handler).toHaveBeenCalled();
    });

    it('hover special handling', () => {
      const q = Q.add('div');
      const handler = vi.fn();
      q.on('hover', handler);
      
      q[0].dispatchEvent(new MouseEvent('mouseenter'));
      expect(handler).toHaveBeenCalledWith(q[0], true, expect.any(Event));
      
      q[0].dispatchEvent(new MouseEvent('mouseleave'));
      expect(handler).toHaveBeenCalledWith(q[0], false, expect.any(Event));
    });

    it('ui', () => {
      const q = Q.add('div');
      q.ui({ bg: 'red', text: 'blue', fontSize: '20px' });
      const el = q[0] as HTMLElement;
      expect(el.style.background).toBe('red');
      expect(el.style.color).toBe('blue');
      expect(el.style.fontSize).toBe('20px');
    });
  });

  describe('Q.state & bind', () => {
    it('should update on state change', () => {
      const state = Q.state('initial');
      const q = Q.add('div');
      q.bind(state, (v) => v.toUpperCase(), 'text');
      
      expect(q.content()).toBe('INITIAL');
      
      state.value = 'updated';
      expect(q.content()).toBe('UPDATED');
    });

    it('bind html', () => {
      const state = Q.state('<b>1</b>');
      const q = Q.add('div');
      q.bind(state, (v) => v, 'html');
      expect(q.html()).toBe('<b>1</b>');
    });

    it('bind attr', () => {
      const state = Q.state('val1');
      const q = Q.add('div');
      q.bind(state, (v) => ({ 'data-state': v }), 'attr');
      expect(q.attr('data-state')).toBe('val1');
      
      state.value = 'val2';
      expect(q.attr('data-state')).toBe('val2');
    });

    it('bind class', () => {
      const state = Q.state(true);
      const q = Q.add('div');
      q.bind(state, (v) => ({ active: v }), 'class');
      expect(q[0].classList.contains('active')).toBe(true);
      
      state.value = false;
      expect(q[0].classList.contains('active')).toBe(false);
    });

    it('bind css', () => {
      const state = Q.state('red');
      const q = Q.add('div');
      q.bind(state, (v) => ({ bg: v }), 'css');
      expect((q[0] as HTMLElement).style.background).toBe('red');
    });
  });

  describe('Components', () => {
    it('component, use, mount', () => {
      Q.component('MyComp', () => Q.add('div.my-comp').content('Comp Content'));
      
      const container = document.createElement('div');
      const mounted = Q.mount('MyComp', container);
      
      expect(mounted[0].classList.contains('my-comp')).toBe(true);
      expect(mounted.content()).toBe('Comp Content');
      expect(container.contains(mounted[0])).toBe(true);
    });
  });
});
