import { useState } from "react";

// **Сбросьте состояние компонента через key**

// **Проблема:**
// Напишите черновик сообщения Алисе и переключитесь на Боба — черновик «переедет» к Бобу.
// React сохраняет состояние Chat, потому что компонент остаётся на том же месте в дереве.

// **Требования:**
// 1. При смене собеседника черновик должен очищаться.
// 2. Не используйте useEffect для сброса состояния.
// 3. Компонент Chat менять не нужно — исправление делается в Messenger.

const CONTACTS = [
  { id: 1, name: "Алиса" },
  { id: 2, name: "Боб" },
  { id: 3, name: "Таня" },
];

const Chat = ({ contact }) => {
  const [draft, setDraft] = useState("");

  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={`Сообщение для ${contact.name}`}
      />
      <button>Отправить {contact.name}</button>
    </div>
  );
};

const Messenger = () => {
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);

  return (
    <div>
      {CONTACTS.map((contact) => (
        <button key={contact.id} onClick={() => setActiveContact(contact)}>
          {contact.name}
        </button>
      ))}
      <Chat contact={activeContact} />
    </div>
  );
};

export default Messenger;
