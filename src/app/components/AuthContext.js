// src/app/components/AuthContext.js
'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '../configs/general';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Armazenar dados do usuário globalmente
  const [token, setToken] = useState(null); // Store the token directly
  const router = useRouter();

  const setarToken = (token) => {
    setToken(token);
  };

  const checkLoginStatus = () => {
    const storedToken = sessionStorage.getItem('token');
    const loggedIn = !!storedToken;
    setIsLoggedIn(loggedIn);
    setToken(storedToken); // Update the token state


    if (loggedIn) {
      // Ler dados do sessionStorage e atualizar o estado global
      const name = sessionStorage.getItem('name');
      const email = sessionStorage.getItem('email');
      const cellphone = sessionStorage.getItem('cellphone');
      setUserData({ name, email, cellphone });
    } else {
      setUserData(null); // Limpar dados se não houver token
    }
  };
  useEffect(() => {
    console.log("Token value in useEffect:", token); // [5] -  This is where you are seeing null
  }, [token]);

  const validateToken = async () => {
      const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
          try {
            const response = await fetch(`https://${API}/validate-token`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
              },
            });
            if (!response.ok) {
              logout(); // Logout se token inválido or expired
              return;
            }
            const data = await response.json();
            if (!data.valid) {
              logout();
            }
          } catch (error) {
            console.error("Erro ao validar token:", error);
            logout();
          }
        } else {
          setIsLoggedIn(false);
          setToken(null); //Also, set token to null.
        }
  };

  const login = async (newToken, user) => {
    const novoToken = newToken
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('name', user.name);
    sessionStorage.setItem('email', user.email);
    sessionStorage.setItem('cellphone', user.cellphone);
    setIsLoggedIn(true);
    setUserData(user);
    setarToken(novoToken); // Update token state
    
    try{
         await validateToken(); // Validate the token AFTER storing it
         router.push('/');
    }
    catch(error){
      console.error("Token validation failed after login:", error);
      logout(); // Log out if validation fails
    }

  };


  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('cellphone');
    setIsLoggedIn(false);
    setUserData(null); // Limpar dados do usuário
    setToken(null); // Clear token state
    router.push('/registro');
  };

  useEffect(() => {
    checkLoginStatus(); // Verificar status ao montar o componente
    validateToken();   // Validar token ao montar
    const intervalId = setInterval(validateToken, 1200000);

    // Ouvir eventos de storage *vindas de outras abas/janelas*
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const contextValue = {
    isLoggedIn,
    userData, // Expor dados do usuário no contexto
    token,     // Expose the token
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};