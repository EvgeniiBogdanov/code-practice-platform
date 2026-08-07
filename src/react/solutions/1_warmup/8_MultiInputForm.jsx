import { useState } from 'react';

const MultiInputForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Имя"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="Город"
      />
      <p>Имя: {form.name}</p>
      <p>Email: {form.email}</p>
      <p>Город: {form.city}</p>
    </div>
  );
};

export default MultiInputForm;
