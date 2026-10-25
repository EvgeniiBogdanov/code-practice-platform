// В чате сообщение должно появиться в списке мгновенно, не дожидаясь сервера
// (optimistic update). Если отправка не удалась, сообщение не исчезает:
// оно помечается «не отправлено», и пользователь может повторить отправку.
//
// Реализуйте createMessageOutbox({ send, onChange, createId }):
// - post(text) сразу добавляет сообщение { id, text, status: "sending" } в конец
//   списка и вызывает onChange с новым списком (массив каждый раз новый);
// - send({ id, text }) возвращает промис; успех → status "sent", отказ → "failed";
// - сообщения отправляются строго по очереди: следующий send вызывается только
//   после завершения предыдущего (успешного или нет), чтобы порядок в чате не нарушился;
// - ошибка одного сообщения не блокирует остальные;
// - retry(id) работает только для сообщений со статусом "failed": ставит "sending"
//   и отправляет заново (в конец очереди); для остальных ничего не делает;
// - createId по умолчанию — () => crypto.randomUUID().

export type MessageStatus = "sending" | "sent" | "failed";

export interface OutboxMessage {
  id: string;
  text: string;
  status: MessageStatus;
}

export interface MessageOutboxOptions {
  send: (message: { id: string; text: string }) => Promise<void>;
  onChange: (messages: OutboxMessage[]) => void;
  createId?: () => string;
}

export interface MessageOutbox {
  post: (text: string) => void;
  retry: (id: string) => void;
}

export function createMessageOutbox(options: MessageOutboxOptions): MessageOutbox {
  return {
    post: () => {},
    retry: () => {},
  };
}
