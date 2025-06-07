// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzdBCfUUcQKGFj_QC_3baxBybdj3N-nhI",
  authDomain: "clinic-12371.firebaseapp.com",
  projectId: "clinic-12371",
  storageBucket: "clinic-12371.firebasestorage.app",
  messagingSenderId: "636272500930",
  appId: "1:636272500930:web:d8b8c0883a3fbed8fa9b5b",
  measurementId: "G-F03KT504RJ"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
export { auth }; 