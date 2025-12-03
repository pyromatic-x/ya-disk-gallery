const sibling_file_navigation = "navigated-to-sibling-file";

interface TEventsMap {
  [sibling_file_navigation]: unknown;
}

type TEvents = keyof TEventsMap;
type TListeners = Partial<Record<TEvents, Array<(data?: unknown) => void>>>;

class EventBusBase {
  private listeners: TListeners = {};

  emit<T extends TEvents>(event: T, data?: TEventsMap[T]): void {
    const event_listeners = this.listeners[event];

    if (process.env.NODE_ENV === "development") {
      console.log(
        `EventBus: "${event}"\nData: ${data}\nListeners: ${event_listeners?.length || 0}`,
      );
    }

    if (event_listeners) {
      event_listeners.forEach((callback) => {
        callback(data);
      });
    }
  }

  subscribe<T extends TEvents>(event: T, callback: (data: TEventsMap[T]) => void): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback as (data: unknown) => void);

    return () => {
      this.listeners[event] = this.listeners[event]?.filter((cb) => cb !== callback);
    };
  }
}

export const EventBus = new EventBusBase();
