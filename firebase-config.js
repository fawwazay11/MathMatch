import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3vUM3iMO9QK2a8ue_cQuJyni-vy8TSWM",
    authDomain: "mathmatch-853eb.firebaseapp.com",
    projectId: "mathmatch-853eb",
    storageBucket: "mathmatch-853eb.appspot.com",
    messagingSenderId: "234722458779",
    appId: "1:234722458779:web:db2d76c53c052880f19a3e",
    measurementId: "G-QV6QYR8H38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication instance
export const auth = getAuth(app);
