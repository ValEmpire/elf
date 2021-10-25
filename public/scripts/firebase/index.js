// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
  getStorage,
  ref,
  uploadString,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4ET18O_BO2E6UxPMAnKB-KIlwTpSKTRs",
  authDomain: "elf-2e2a6.firebaseapp.com",
  projectId: "elf-2e2a6",
  storageBucket: "elf-2e2a6.appspot.com",
  messagingSenderId: "745836589278",
  appId: "1:745836589278:web:e27691eb869badc512524f",
  measurementId: "G-L2XPB9H4J0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

console.log("Firebase initialized");

export { storage, ref, uploadString };
