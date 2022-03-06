import * as firebase from "firebase";
import "firebase/firestore";

let config = {
  // your firbase account config
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

firebase.initializeApp(config);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore }

