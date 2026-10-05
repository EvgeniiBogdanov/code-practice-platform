import { useState } from "react";

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
      {/* Новый key = новый экземпляр Chat: React размонтирует старый и создаст чистый */}
      <Chat key={activeContact.id} contact={activeContact} />
    </div>
  );
};

export default Messenger;
