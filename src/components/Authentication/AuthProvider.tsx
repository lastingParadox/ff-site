// https://medium.com/@yogeshmulecraft/implementing-protected-routes-in-react-js-b39583be0740

import { createContext, useContext, useState } from "react";

// This is here to make TypeScript shut up
let defaultValue: any;
const AuthContext = createContext(defaultValue);

export const AuthProvider = ({ children }: { children: any }) => {
    type AuthType = { 
        isAuthenticated: boolean,
        login: (userToken: any) => void,
        logout: () => void,
    } 

    const [token, setToken] = useState<AuthType | null>(); 
    const login = (userToken: any) => {
        setToken(userToken);
    };

    const logout = () => {
        setToken(null);
    };
    
    const isAuthenticated = !!token; 
    
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};