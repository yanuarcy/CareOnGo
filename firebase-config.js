// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// export const firebaseConfig = {
//   apiKey: "AIzaSyCtN0csy4ylDxWSXnkLp_psgnSnsFozNJ4",
//   authDomain: "careongo-7a6cd.firebaseapp.com",
//   projectId: "careongo-7a6cd",
//   storageBucket: "careongo-7a6cd.appspot.com",
//   messagingSenderId: "485747146509",
//   appId: "1:485747146509:web:bb42a4d3ef8439072a7a44",
//   measurementId: "G-F968EKEQKX"
// };
export const firebaseConfig = {
  apiKey: "AIzaSyCwuTLMgPJwgUOlcP4fnwumSdXuJdQ1M_A",
  authDomain: "care-on-go.firebaseapp.com",
  projectId: "care-on-go",
  storageBucket: "care-on-go.appspot.com",
  messagingSenderId: "833113787877",
  appId: "1:833113787877:web:99380a5a830f02f8afb30c"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);