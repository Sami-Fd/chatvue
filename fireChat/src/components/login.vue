<template>
  <div class="d-flex align-center justify-center">
    <v-btn color="primary" @click="signInWithGoogle">Signin with Google</v-btn>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import UsersService from "../services/UsersService";

export default {
  data() {
    return {};
  },
  created() {
    //this.userSigned()
  },
  methods: {
    signInWithGoogle() {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          this.$router.push({ path: "/" });
          var credential = result.credential;

          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // The signed-in user info.
          var userIn = result.user;
          await this.checkUserInList(userIn);
          console.log("token, userIn", token, userIn);
          // Add a new document in collection "users"

          // ...
        })
        .catch((error) => {
          var errorMessage = error.message;
          console.log(errorMessage);
        });
    },
    //check user existence in db users
    checkUserInList(userIn) {
      UsersService.getAll()
        .get()
        .then((res) =>
          res.docs.forEach(async (doc) => await this.addUser(doc, userIn))
        );
    },
    // add user on sign in
    addUser(user, userIn) {
      console.log("ids", userIn.uid, user.id);
      // update if user exist
      if (user.id === userIn.uid) {
        console.log("from update login");
        UsersService.update(user.id, { active: true, date: new Date() })
          .then(() => {
            console.log("updated succes");
          })
          .catch((e) => {
            console.log(e);
          });
      }
      // add if user dosn't exist
      if (!user.id) {
        console.log("from set login");

        UsersService.getAll()
          .doc(userIn.uid)
          .set({
            id: userIn.uid,
            avatar: userIn.photoURL,
            uname: userIn.displayName,
            date: new Date(),
            discussion: [],
            active: true,
          })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      }
    },
  },
};
</script>
