import React, { createContext, useContext, useState } from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// AuthContext создается с дефолтным значением {} as any.
// При использовании хука useAuth() нет никакой проверки на наличие Provider, 
// из-за чего вызов контекста вне провайдера приводит к падению приложения с ошибкой TypeError runtime.
//
// Требования:
// 1. Создайте тип AuthContextType для данных пользователя и функций login/logout
// 2. Инициализируйте createContext<AuthContextType | null>(null)
// 3. Реализуйте хук useAuth(), который делает runtime-проверку на null и выбрасывает понятную ошибку

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
  // ❌ Нет проверки на null, если вызвать компонент без AuthProvider
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
