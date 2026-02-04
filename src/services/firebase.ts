import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, collection } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// Tip: Public credentials for client-side apps are standard in Firebase.
// Security Rules are what protect the data.
const firebaseConfig = {
    apiKey: "AIzaSyAn6RoM0xEBGz3Sqqqw3b82_A2O9nikkRM",
    authDomain: "glucamigo.firebaseapp.com",
    projectId: "glucamigo",
    storageBucket: "glucamigo.firebasestorage.app",
    messagingSenderId: "509189286065",
    appId: "1:509189286065:web:e79aba4e34719c354c5a90"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Simple hook to ensure we are logged in
export const initAuth = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("🔥 Firebase: Conectado como", user.uid);
        } else {
            signInAnonymously(auth)
                .then(() => console.log("🔥 Firebase: Inicio de sesión anónimo exitoso"))
                .catch((error) => console.error("🔥 Firebase Error:", error));
        }
    });
};

export const saveProfileToCloud = async (profile: any) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
        await setDoc(doc(db, "users", user.uid), { ...profile, updatedAt: new Date().toISOString() }, { merge: true });
        console.log("💾 Perfil guardado en nube");
    } catch (e) {
        console.error("Error guardando perfil:", e);
    }
};

export const saveLogToCloud = async (log: any) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
        // We use a subcollection 'logs' for each user
        await setDoc(doc(db, "users", user.uid, "logs", log.id.toString()), log);
        console.log("💾 Log guardado en nube");
    } catch (e) {
        console.error("Error guardando log:", e);
    }
};
