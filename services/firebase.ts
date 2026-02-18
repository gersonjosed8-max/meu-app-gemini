
/**
 * GERGER.GE Firebase Connectivity Template
 * 
 * Instructions:
 * Replace the config object below with your actual Firebase Project credentials.
 * This handles Real-time Database synchronization for Bible projects.
 */

// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "gerger-translator.firebaseapp.com",
  projectId: "gerger-translator",
  storageBucket: "gerger-translator.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

export const mockFirebaseStatus = "MOCK_CONNECTED";
