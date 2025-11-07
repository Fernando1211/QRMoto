import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3ILU20b2omSdsWVre7GdkPsyvVzbWaXo",
  authDomain: "mottu-ed692.firebaseapp.com",
  projectId: "mottu-ed692",
  storageBucket: "mottu-ed692.firebasestorage.app",
  messagingSenderId: "277803232276",
  appId: "1:277803232276:web:77d26a46e9b019faa14b01",
  measurementId: "G-GSW65RFBMH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
