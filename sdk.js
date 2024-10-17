// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRiW2yQwa0_NcBSO_rKyx3vuzPY-2OEeI",
  authDomain: "csc-vm.firebaseapp.com",
  projectId: "csc-vm",
  storageBucket: "csc-vm.appspot.com",
  messagingSenderId: "949674453325",
  appId: "1:949674453325:web:736dd3fb7f0504bb7aef04",
  measurementId: "G-GZHDGE9721"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);