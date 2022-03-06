import * as firebase from "firebase";
import "firebase/firestore";

let config = {
  apiKey: "AIzaSyAp1OdrrVLedbJPgcEZ87951Wjqt_18YE4",
  authDomain: "firechat-7a8d9.firebaseapp.com",
  databaseURL: "https://firechat-7a8d9-default-rtdb.firebaseio.com",
  projectId: "firechat-7a8d9",
  storageBucket: "firechat-7a8d9.appspot.com",
  messagingSenderId: "448283085253",
  appId: "1:448283085253:web:e107e5e5f33822bfaae3ac"
};

firebase.initializeApp(config);

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore }

