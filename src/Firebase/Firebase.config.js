// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTMo5kJIwUTM7FTc3tcvpy00g1dxrVLqI",
  authDomain: "garmentix-cecdb.firebaseapp.com",
  projectId: "garmentix-cecdb",
  storageBucket: "garmentix-cecdb.firebasestorage.app",
  messagingSenderId: "963712142714",
  appId: "1:963712142714:web:7be3f84bac1c39dcf61ac3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);