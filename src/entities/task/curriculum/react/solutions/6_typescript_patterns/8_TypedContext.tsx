import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

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

  const login = useCallback((name: string) => setUser(name), []);
  const logout = useCallback(() => setUser(null), []);

  // Контекст авторизации читают многие компоненты: value меняет ссылку только при смене user
  const value = useMemo<AuthContextType>(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
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
