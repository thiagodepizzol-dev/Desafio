import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcuvdJ7rGvw9OPcogja9BdTnda7ihJZmk",
  authDomain: "dias-3b6d2.firebaseapp.com",
  projectId: "dias-3b6d2",
  storageBucket: "dias-3b6d2.firebasestorage.app",
  messagingSenderId: "761341789041",
  appId: "1:761341789041:web:46798555abde44faedacd0",
  measurementId: "G-9Y1K16JC7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
