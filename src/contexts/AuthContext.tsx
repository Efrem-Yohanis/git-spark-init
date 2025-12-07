import { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'manager' | 'waiter' | 'chef' | 'kitchen_manager';

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const roleNames: Record<UserRole, string> = {
  manager: 'John Manager',
  waiter: 'Sarah Waiter',
  chef: 'Maria Chef',
  kitchen_manager: 'Tom Kitchen',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('restaurant_user');
    return saved ? JSON.parse(saved) : { id: '1', name: 'John Manager', role: 'manager' };
  });

  const login = (role: UserRole) => {
    const newUser: User = {
      id: '1',
      name: roleNames[role],
      role,
    };
    setUser(newUser);
    localStorage.setItem('restaurant_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('restaurant_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
