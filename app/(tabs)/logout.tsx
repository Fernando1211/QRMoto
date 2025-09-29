// app/logout.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { auth } from "../../service/firebaseConfig";
import {
  updateProfile,
  updateEmail,
} from "firebase/auth";
import { useAuth } from "../../src/context/AuthContext";

type SafeProfile = {
  uid?: string;
  name: string;
  email: string;
};

function buildSafeProfile(stored: any): SafeProfile {
  let email: string = "";
  if (stored && typeof stored === "object") {
    if (typeof stored.email === "string") {
      email = stored.email;
    } else if (
      Array.isArray(stored.providerData) &&
      stored.providerData[0] &&
      typeof stored.providerData[0].email === "string"
    ) {
      email = stored.providerData[0].email;
    }
  }

  const candidates: string[] = [];
  if (stored && typeof stored === "object") {
    if (typeof stored.name === "string" && stored.name.trim()) {
      candidates.push(stored.name.trim());
    }
    if (typeof stored.displayName === "string" && stored.displayName.trim()) {
      candidates.push(stored.displayName.trim());
    }
    if (
      Array.isArray(stored.providerData) &&
      stored.providerData[0] &&
      typeof stored.providerData[0].displayName === "string" &&
      stored.providerData[0].displayName.trim()
    ) {
      candidates.push(stored.providerData[0].displayName.trim());
    }
  }

  const name =
    candidates.length > 0
      ? candidates[0]
      : email
      ? email.split("@")[0]
      : "Usuário";

  return {
    uid: stored?.uid,
    name,
    email: email || "",
  };
}

export default function LogoutScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<SafeProfile | null>(null);

  // modal edição
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("@user");
        if (!raw) {
          setProfile(null);
          setLoading(false);
          return;
        }
        let parsed: any = null;
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = null;
        }
        const p = buildSafeProfile(parsed);
        setProfile(p);
      } catch (e) {
        console.log("Erro ao carregar @user:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openEdit = () => {
    if (!profile) return;
    setNameInput(profile.name || "");
    setEmailInput(profile.email || "");
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!profile) return;
    if (!nameInput.trim() || !emailInput.trim()) {
      Alert.alert("Atenção", "Preencha nome e e-mail.");
      return;
    }

    const user = auth.currentUser;
    let updatedLocal = { ...profile, name: nameInput.trim(), email: emailInput.trim() };

    try {
      // Atualiza displayName (não exige reauth normalmente)
      if (user && nameInput.trim() !== profile.name) {
        await updateProfile(user, { displayName: nameInput.trim() });
      }

      // Tenta atualizar o e-mail também no Auth (pode exigir reautenticação)
      if (user && emailInput.trim() !== profile.email) {
        try {
          await updateEmail(user, emailInput.trim());
        } catch (err: any) {
          console.log("Falha ao atualizar e-mail no Auth:", err?.code || err?.message || err);
          Alert.alert(
            "Aviso",
            "Não foi possível atualizar o e-mail no Firebase agora (pode exigir reautenticação). O e-mail foi atualizado localmente."
          );
        }
      }

      // Atualiza cache local “@user”
      const raw = await AsyncStorage.getItem("@user");
      let prev = null;
      try {
        prev = raw ? JSON.parse(raw) : null;
      } catch {
        prev = null;
      }

      const toStore = {
        ...(prev || {}),
        uid: user?.uid ?? prev?.uid,
        displayName: nameInput.trim(),
        email: emailInput.trim(),
        name: nameInput.trim(),
      };

      await AsyncStorage.setItem("@user", JSON.stringify(toStore));
      setProfile(updatedLocal);
      setEditing(false);
      Alert.alert("Sucesso", "Perfil atualizado.");
    } catch (e) {
      console.log("Erro ao salvar edição:", e);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {profile ? (
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{profile.name || "-"}</Text>

          <Text style={[styles.label, { marginTop: 12 }]}>E-mail</Text>
          <Text style={styles.value}>{profile.email || "-"}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.editBtn]} onPress={openEdit}>
              <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.logoutBtn]} onPress={handleLogout}>
              <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={{ color: "#aaa", textAlign: "center" }}>
          Nenhum usuário logado.
        </Text>
      )}

      {/* Modal de edição */}
      <Modal visible={editing} transparent animationType="fade" onRequestClose={() => setEditing(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#aaa"
              value={nameInput}
              onChangeText={setNameInput}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailInput}
              onChangeText={setEmailInput}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: "#333" }]} onPress={() => setEditing(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: "#00BFFF" }]} onPress={saveEdit}>
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.hint}>
              * Atualizar e-mail no Firebase pode exigir reautenticação. Caso falhe, o app mantém a mudança local.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  card: { backgroundColor: "#1a1a1a", borderRadius: 12, padding: 16 },
  label: { color: "#9aa0a6", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  value: { color: "#fff", fontSize: 16, marginTop: 4 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 16 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  editBtn: { backgroundColor: "#2b6cb0" },
  logoutBtn: { backgroundColor: "#e63946" },
  btnText: { color: "#fff", fontWeight: "700" },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 16 },
  modalCard: { backgroundColor: "#1E1E1E", borderRadius: 12, padding: 16 },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: {
    backgroundColor: "#282828",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  hint: { color: "#9aa0a6", fontSize: 12, marginTop: 8 },
});
