import React, { createContext, useContext, useState } from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * Разрабатывается глобальный контекст авторизации `AuthContext` и пользовательский хук `useAuth`.
 *
 * ПРОБЛЕМА:
 * Контекст инициализирован фиктивным значением через `as any`. Если компонент ошибочно используется
 * вне `<AuthProvider>`, приложение падает в runtime с невнятной ошибкой `TypeError`, хотя компилятор TypeScript
 * не предупреждает о потенциальной проблеме.
 *
 * ТРЕБОВАНИЯ:
 * 1. Опишите строгий тип данных контекста авторизации (пользователь, методы login и logout).
 * 2. Инициализируйте контекст значением `null`, явно отражающим отсутствие данных вне провайдера.
 * 3. Реализуйте кастомный хук `useAuth`, который валидирует наличие контекста и выбрасывает понятную ошибку при вызове вне провайдера, избавляя компоненты-потребители от проверок на `null`.
 */

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = (name: string) => setUser(name);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default function Demo() {
  return (
    <AuthProvider>
      <UserProfile />
    </AuthProvider>
  );
}

function UserProfile() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      {user ? (
        <>
          <p>Привет, {user}!</p>
          <button onClick={logout}>Выйти</button>
        </>
      ) : (
        <button onClick={() => login('Алексей')}>Войти как Алексей</button>
      )}
    </div>
  );
}
