import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
const getProfile = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/user/profile", {
       withCredentials: true // KJO ËSHTË KRITIKE
    });
    setUserInfo(data);
  } catch (e) {
    console.error("Sesioni ka skaduar ose nuk është dërguar:", e);
  }
};
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, ready }}>
      {children}
    </UserContext.Provider>
  );
}