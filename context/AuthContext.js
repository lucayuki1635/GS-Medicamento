import axios from "axios";
import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [usertype, setUsertype] = useState(null);
  const [userId, setUserID] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  async function login(credenciais) {
    const resp = await axios.get("http://localhost:3000/usuarios");
    const usuarios = resp.data;
    const usuario = usuarios.find((u) => u.email === credenciais.email);
    if (usuario?.senha === credenciais.senha) {
      setUsername(usuario.nome);
      setUsertype(usuario.tipo);
      setUserID(usuario.id);
      return true;
    }
    return false;
  }

  function increaseNotificationCount() {
    setNotificationCount((prevCount) => prevCount + 1);
  }

  return (
    <AuthContext.Provider
      value={{
        username,
        usertype,
        userId,
        login,
        notificationCount,
        increaseNotificationCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
