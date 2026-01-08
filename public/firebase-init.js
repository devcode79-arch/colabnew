// firebase-init.js

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHyQvjjHK5L7M_eeRzCIl8KnSFWBZUyyE",
  authDomain: "colabnew-8d474.firebaseapp.com",
  projectId: "colabnew-8d474",
  storageBucket: "colabnew-8d474.firebasestorage.app",
  messagingSenderId: "1061842493012",
  appId: "1:1061842493012:web:551e3fd12d228ae4b6d7c1",
  measurementId: "G-42MXHKXMMQ"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// const storage = firebase.storage(); // Removed as Firebase Storage is not used
