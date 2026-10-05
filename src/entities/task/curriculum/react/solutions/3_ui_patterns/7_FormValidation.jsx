import React, { useId, useState } from 'react';

const INITIAL_VALUES = { email: '', password: '', confirm: '' };

// Валидация — чистая функция: ошибки вычисляются из значений, а не хранятся в state
const validate = ({ email, password, confirm }) => {
  const errors = {};
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Введите корректный email';
  if (password.length < 8 || !/\d/.test(password)) {
    errors.password = 'Минимум 8 символов и хотя бы одна цифра';
  }
  if (confirm !== password || !confirm) errors.confirm = 'Пароли не совпадают';
  return errors;
};

const Field = ({ label, name, type = 'text', value, error, showError, onChange, onBlur }) => {
  const id = useId();
  const errorId = `${id}-error`;
  const isInvalid = showError && Boolean(error);

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
      />
      {isInvalid && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

const RegistrationForm = () => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const errors = validate(values);
  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (hasErrors) return;
    console.log('Регистрация:', values);
    setIsDone(true);
  };

  if (isDone) return <p>Готово!</p>;

  const fieldProps = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    showError: isSubmitted || touched[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Email" type="email" {...fieldProps('email')} />
      <Field label="Пароль" type="password" {...fieldProps('password')} />
      <Field label="Повторите пароль" type="password" {...fieldProps('confirm')} />
      <button type="submit" disabled={hasErrors}>
        Зарегистрироваться
      </button>
    </form>
  );
};

export default RegistrationForm;
