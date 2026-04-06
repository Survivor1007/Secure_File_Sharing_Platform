import React, { useState, useEffect, createContext,useContext, type ReactNode } from "react";
import fetchClient from "../lib/api";
import {type RegisterData, type  User } from "../types";


interface AuthContextType{
      user: User | null;
      isLoading: boolean;
      isAuthenticated: boolean;
      login:(email: string, password:string) => Promise<void>;
      register:(data:RegisterData) => Promise<void>;
      logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children : ReactNode}) => {
      const [user, setUser] = useState<User | null>(null);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
            const restoreSession = async () => {
                  try{
                        const data = await fetchClient('/auth/refresh',{
                              method:'POST',
                        });
                        if(data.accessToken){

                              setUser({id:'temp', email: 'user@example.com'});
                        }
                  }catch(err){
                        setUser(null);
                  }finally{
                        setIsLoading(false);
                  }
            }

            restoreSession();
      }, []);

      const login = async (email: string, password: string) => {
            const data = await fetchClient('/auth/login', {
                  method: 'POST',
                  body:JSON.stringify({email, password}),
            });
            setUser({id: 'temp', email});
      };

      const register = async (data: RegisterData) => {
            await fetchClient('/auth/register', {
                  method:'POST',
                  body: JSON.stringify(data),
            });
      };

      const logout = async () => {
            try{
                  await fetchClient('/auth/logout', {method:'POST'});
            }catch(err){
                  console.error('Logout error:', err);
            }
            setUser(null);
      };

      return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
      const context = useContext(AuthContext);

      if(context == undefined){
            throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
}


