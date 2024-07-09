import { useContext, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebaseService";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const [error, setError] = useState(null);

  const checkUser = onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true);
      setUser(user);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    setIsLoading(false);
  });

  useEffect(() => {
    return () => checkUser();
  }, [auth, trigger]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        error,
        setUser,
        trigger,
        checkUser,
        isLoading,
        isLoggedIn,
        setTrigger,
        setIsLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
