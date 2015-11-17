export class EventRegistry {
  constructor() {
    this.registry = {};
  }

  subscribe(evt, fn) {
    this.lookup(evt).add(fn);
  }

  unsubscribe(evt, subscriber) {
    this.lookup(evt).delete(subscriber);
  }

  post(evt, val) {
    for (const subscriber of this.lookup(evt)) {
      subscriber(evt, val);
    }
  }

  lookup(event) {
    if (!this.registry[event]) {
      this.registry[event] = new Set();
    }

    return this.registry[event];
  }
}

export const sharedRegistry = new EventRegistry();
