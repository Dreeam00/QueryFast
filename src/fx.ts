/**
 * QueryFast FX: Modular extensions for the Atomic DOM Engine.
 */

export const FX = {
  /**
   * Animation & Transition presets
   */
  motion: {
    fadeIn: (el: any, duration = 300) => 
      (el[0] || el).animate([{ opacity: 0 }, { opacity: 1 }], { duration, fill: 'forwards' }).finished,
    
    fadeOut: (el: any, duration = 300) => 
      (el[0] || el).animate([{ opacity: 1 }, { opacity: 0 }], { duration, fill: 'forwards' }).finished,
    
    slideIn: (el: any, { x = 0, y = 20, duration = 300 } = {}) => 
      (el[0] || el).animate([
        { opacity: 0, transform: `translate(${x}px, ${y}px)` },
        { opacity: 1, transform: 'translate(0, 0)' }
      ], { duration, fill: 'forwards', easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }).finished,

    shake: (el: any, duration = 400) => 
      (el[0] || el).animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
      ], { duration }).finished
  },

  /**
   * Atomic Form Helper
   */
  form: (initial: Record<string, any>) => {
    const state: any = (window as any).Q.state(initial);
    return {
      state,
      bind: (name: string) => ({
        on: (el: any) => {
          el.on('input', (e: any) => state.value = { ...state.value, [name]: e.value });
          el[0].value = state.value[name] || '';
        }
      })
    };
  },

  /**
   * Simple Store Pattern
   */
  store: (initial: any) => (window as any).Q.state(initial)
};

// Global export
if (typeof window !== 'undefined') {
  (window as any).FX = FX;
}
