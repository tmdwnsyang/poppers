// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL5zVdi28woZKwXaqQGn488oaV4pfi5Fk",
  authDomain: "poppers-774a0.firebaseapp.com",
  projectId: "poppers-774a0",
  storageBucket: "poppers-774a0.appspot.com",
  messagingSenderId: "262767763780",
  appId: "1:262767763780:web:c2276624df9b1cd6dd7711",
  measurementId: "G-SCTSNJJ1F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);