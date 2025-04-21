
import { useContext, createContext } from 'react';
import { AuthContextProps } from '@/components/AuthProvider'; // Import the interface

// Create AuthContext
export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
    
