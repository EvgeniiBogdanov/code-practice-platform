import React, { createContext, useContext, useState } from 'react';

//  РЕШЕНИЕ:
// 1. Описываем строгий тип значения контекста
export type AuthContextType = {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
};

// 2. Инициализируем контекст со значением null по умолчанию
const AuthContext = createContext<AuthContextType | null>(null);

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

// 3. Создаем кастомный хук с автоматической проверкой на null
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри <AuthProvider>');
  }
  return context;
}

export default function Demo() {
  return (
    <AuthProvider>
      <UserProfile />
    </AuthProvider>
  );
}

function UserProfile() {
  // context гарантированно имеет тип AuthContextType (без null)!
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

/*
=== Разбор решения ===
Проблема: Использование `createContext({} as AuthContextType)` обманывает TypeScript. Если забыть обернуть компонент в `<AuthProvider>`, `useContext` вернет пустой объект `{}`, и приложение упадёт при вызове `login('...')` с трудноотлавливаемой ошибкой runtime.

Как надо (React + TS):
1. `createContext<AuthContextType | null>(null)` честно заявляет, что вне провайдера значения нет.
2. Кастомный хук `useAuth()` проверяет `if (!context) throw new Error(...)` и отсекает `null`.
3. В результате все компоненты получают чистый тип `AuthContextType` без необходимости писать `context?.login?.()`.
*/
