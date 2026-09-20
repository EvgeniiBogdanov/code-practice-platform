interface EventMap {
  userCreated: { id: number; name: string };
  userDeleted: { id: number };
}

class EventEmitter<Events extends object> {
  private listeners: {
    [K in keyof Events]?: Array<(payload: Events[K]) => void>;
  } = {};

  on<K extends keyof Events>(
    event: K,
    callback: (payload: Events[K]) => void
  ): void {
    const listeners = (this.listeners[event] ??= []);
    listeners.push(callback);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    (this.listeners[event] || []).forEach((cb) => cb(payload));
  }
}

const emitter = new EventEmitter<EventMap>();

emitter.on("userCreated", (user) => console.log(user.name));
emitter.emit("userCreated", { id: 1, name: "Alice" });
