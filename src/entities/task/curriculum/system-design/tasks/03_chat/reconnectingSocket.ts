// Чат держит WebSocket. Соединение рвётся: метро, смена сети, деплой сервера.
// Если переподключаться сразу и без паузы, тысячи клиентов одновременно
// «положат» сервер, который только что поднялся (thundering herd).
//
// Реализуйте createReconnectingSocket(url, handlers, options):
// - сразу открывает new WebSocket(url);
// - сообщения сервера передаёт в handlers.onMessage(data);
// - при обрыве переподключается с экспоненциальной задержкой и «полным джиттером»:
//   задержка = random() * min(maxDelayMs, baseDelayMs * 2 ** попытка), попытки идут с нуля;
// - после успешного открытия счётчик попыток сбрасывается;
// - handlers.onStatusChange вызывается при смене состояния:
//   "connecting" (первое подключение) → "open" → "reconnecting" (ждём или подключаемся) → "open" … → "closed";
// - send(data), пока сокет не открыт, не теряет сообщение: оно уходит сразу после открытия, по порядку;
// - close() закрывает сокет, отменяет ожидание и больше не переподключается.
// Значения по умолчанию: baseDelayMs = 1000, maxDelayMs = 30000, random = Math.random.

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
  options: ReconnectOptions = {}
): ReconnectingSocket {
  return {
    send: () => {},
    close: () => {},
  };
}
