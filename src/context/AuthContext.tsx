import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut as firebaseSignOut, updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "../../service/firebaseConfig"; // ajuste o caminho se preciso

export type Profile = {
  uid: string;
  email: string;
  name: string;
};

type AuthContextType = {
  isLogged: boolean | null;
  user: Profile | null;
  // >>> login agora aceita 2º parâmetro OPCIONAL
  login: (firebaseUser: any, overrideName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateLocalName: (newName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLogged: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  updateLocalName: async () => {},
});

// helper para normalizar perfil
function toProfile(firebaseUser: any, overrideName?: string): Profile {
  const email: string =
    (typeof firebaseUser?.email === "string" && firebaseUser.email) ||
    (Array.isArray(firebaseUser?.providerData) && firebaseUser.providerData[0]?.email) ||
    "";

  const names: string[] = [];
  if (overrideName && overrideName.trim()) names.push(overrideName.trim());
  if (typeof firebaseUser?.displayName === "string" && firebaseUser.displayName.trim())
    names.push(firebaseUser.displayName.trim());
  if (
    Array.isArray(firebaseUser?.providerData) &&
    typeof firebaseUser.providerData[0]?.displayName === "string" &&
    firebaseUser.providerData[0].displayName.trim()
  ) {
    names.push(firebaseUser.providerData[0].displayName.trim());
  }

  const name = names[0] || (email.includes("@") ? email.split("@")[0] : "Usuário");

  return {
    uid: firebaseUser?.uid || "",
    email,
    name,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("@user");
        if (!raw) {
          setIsLogged(false);
          setUser(null);
          return;
        }
        const parsed = JSON.parse(raw);
        if (parsed?.uid) {
          setUser(parsed as Profile);
          setIsLogged(true);
          return;
        }
        const prof = toProfile(parsed);
        await AsyncStorage.setItem("@user", JSON.stringify(prof));
        setUser(prof);
        setIsLogged(true);
      } catch {
        setIsLogged(false);
        setUser(null);
      }
    })();
  }, []);

  // >>> agora aceita overrideName opcional
  const login = async (firebaseUser: any, overrideName?: string) => {
    const prof = toProfile(firebaseUser, overrideName);
    await AsyncStorage.setItem("@user", JSON.stringify(prof));
    setUser(prof);
    setIsLogged(true);

    // tenta setar displayName no Firebase, se veio overrideName
    if (overrideName && auth.currentUser && !auth.currentUser.displayName) {
      try {
        await updateProfile(auth.currentUser, { displayName: overrideName.trim() });
      } catch {
        // ok, fica só local mesmo
      }
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.log("Erro no Firebase signOut:", e);
    }
    await AsyncStorage.removeItem("@user");
    setUser(null);
    setIsLogged(false);
    router.replace("/");
  };

  const updateLocalName = async (newName: string) => {
    if (!user) return;
    const updated = { ...user, name: newName.trim() };
    await AsyncStorage.setItem("@user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ isLogged, user, login, logout, updateLocalName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
