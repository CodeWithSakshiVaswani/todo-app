"use client";

import { auth } from "@/app/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import useRefValue from "@/hooks/firebase/auth/useRefValue";

interface IUserContext {
  user: User | null;
  isInitialLoadingPending: boolean;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  isInitialLoadingPending: true,
});

const AUTH_REQUIRED_PAGES = ["/"];

const AUTH_ABSENCE_REQUIRED_PAGES = ["/login", "/signup"];

const UserContextProvider = ({ children }: React.PropsWithChildren) => {
  const [isInitialLoadingPending, setIsInitialLoadingPending] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const routerCallbackRef = useRefValue(router);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsInitialLoadingPending(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isInitialLoadingPending) {
      if (AUTH_REQUIRED_PAGES.includes(pathname) && !user) {
        routerCallbackRef.current.push("/login");
      } else if (AUTH_ABSENCE_REQUIRED_PAGES.includes(pathname) && user) {
        routerCallbackRef.current.push("/");
      }
    }
  }, [user, pathname, isInitialLoadingPending, routerCallbackRef]);

  return (
    <UserContext.Provider value={{ user, isInitialLoadingPending }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider;
