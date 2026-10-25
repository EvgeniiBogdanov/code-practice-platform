export type SocketStatus = "connecting" | "open" | "reconnecting" | "closed";

export interface SocketHandlers {
  onMessage: (data: string) => void;
  onStatusChange?: (status: SocketStatus) => void;
}

export interface ReconnectOptions {
  baseDelayMs?: number;
  maxDelayMs?: number;
  random?: () => number;
}

export interface ReconnectingSocket {
  send: (data: string) => void;
  close: () => void;
}

export function createReconnectingSocket(
  url: string,
  handlers: SocketHandlers,
  { baseDelayMs = 1000, maxDelayMs = 30000, random = Math.random }: ReconnectOptions = {}
): ReconnectingSocket {
  let socket: WebSocket | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let attempt = 0;
  let isClosed = false;
  const pending: string[] = [];

  const setStatus = (status: SocketStatus): void => handlers.onStatusChange?.(status);

  const connect = (): void => {
    const current = new WebSocket(url);
    socket = current;

    current.onopen = (): void => {
      attempt = 0;
      setStatus("open");
      pending.splice(0).forEach((data) => current.send(data));
    };
    current.onmessage = (event: MessageEvent<string>): void => handlers.onMessage(event.data);
    current.onclose = (): void => {
      if (isClosed) return;
      setStatus("reconnecting");
      // «Полный джиттер»: случайная задержка от 0 до экспоненциального потолка.
      const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
      attempt += 1;
      timer = setTimeout(connect, random() * ceiling);
    };
  };

  setStatus("connecting");
  connect();

  return {
    send: (data) => {
      if (socket?.readyState === WebSocket.OPEN) socket.send(data);
      else pending.push(data);
    },
    close: () => {
      isClosed = true;
      clearTimeout(timer);
      socket?.close();
      setStatus("closed");
    },
  };
}
