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

export function createMessageOutbox({
  send,
  onChange,
  createId = () => crypto.randomUUID(),
}: MessageOutboxOptions): MessageOutbox {
  let messages: OutboxMessage[] = [];
  // Цепочка промисов — это очередь: каждая отправка стартует после предыдущей.
  let queue: Promise<void> = Promise.resolve();

  const setStatus = (id: string, status: MessageStatus): void => {
    messages = messages.map((message) => (message.id === id ? { ...message, status } : message));
    onChange(messages);
  };

  const enqueue = ({ id, text }: OutboxMessage): void => {
    queue = queue.then(async () => {
      try {
        await send({ id, text });
        setStatus(id, "sent");
      } catch {
        setStatus(id, "failed");
      }
    });
  };

  return {
    post: (text) => {
      const message: OutboxMessage = { id: createId(), text, status: "sending" };
      messages = [...messages, message];
      onChange(messages);
      enqueue(message);
    },
    retry: (id) => {
      const message = messages.find((candidate) => candidate.id === id);
      if (!message || message.status !== "failed") return;
      setStatus(id, "sending");
      enqueue(message);
    },
  };
}
