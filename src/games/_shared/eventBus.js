export function createEventBus() {
  const listeners = {};

  return {
    on(event, fn) {
      (listeners[event] ??= []).push(fn);
    },
    off(event, fn) {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter((l) => l !== fn);
    },
    emit(event, ...args) {
      listeners[event]?.forEach((fn) => fn(...args));
    },
    removeAll() {
      Object.keys(listeners).forEach((k) => delete listeners[k]);
    },
  };
}
