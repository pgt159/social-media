// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaxXpQQp_QebRyiQEWo7ZKO7t_f_eZyCs",
  authDomain: "socialmedia-1a6a9.firebaseapp.com",
  projectId: "socialmedia-1a6a9",
  storageBucket: "socialmedia-1a6a9.appspot.com",
  messagingSenderId: "415941452297",
  appId: "1:415941452297:web:6080405212efe6fd790ed8",
  measurementId: "G-XS5PC8HD2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
