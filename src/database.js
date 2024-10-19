import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDRv2sUSBbgsnoJsT1LnUcsE6eFaXXzlDk",
    authDomain: "glimpses-8bf56.firebaseapp.com",
    projectId: "glimpses-8bf56",
    storageBucket: "glimpses-8bf56.appspot.com",
    messagingSenderId: "90716597482",
    appId: "1:90716597482:web:94de9cb882f480504e7b93",
    measurementId: "G-Q00N0G3WRX"
};

/*if (!firebase.apps.length) {
    const app = firebase.initializeApp(firebaseConfig);
}else {
    firebase.app();
}*/

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export const auth = firebase.auth();
export default app;