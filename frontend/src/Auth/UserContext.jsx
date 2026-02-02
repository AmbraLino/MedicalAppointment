import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Kur hapet faqja, kontrollojmë nëse kemi cookie të vlefshme
    if (!userInfo) {
      axios.get("http://localhost:5000/user/profile", { withCredentials: true })
        .then(({ data }) => {
          setUserInfo(data);
          setReady(true);
        })
        .catch(() => {
          setUserInfo(null);
          setReady(true);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, ready }}>
      {children}
    </UserContext.Provider>
  );
}