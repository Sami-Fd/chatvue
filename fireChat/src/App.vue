<template>
  <v-app>
    <v-app-bar app elevation="0">
      <div class="d-flex align-center">
        <v-icon x-large color="orange" class="mx-2">mdi-chat</v-icon>
        <span class="mr-2">FireChat</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn icon v-if="!user">
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn icon v-if="!user">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
      <v-avatar v-if="user">
        <img :src="user.photoURL" alt="userPhoto" />
      </v-avatar>
      <span class="mx-2" v-if="user">{{ user.displayName }}</span>
      <v-btn icon v-if="user" @click="userStatus">
        <v-icon>mdi-power</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="ma-3">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import ChatDataService from "./services/ChatDataService";
import UsersService from "./services/UsersService";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "App",

  components: {},

  data: () => ({
    user: "",
  }),
  computed: {
    ...mapGetters(["getUser"]),
  },
  async created() {
    await this.userSigned();
    await this.userDiscussion();
  },
  watch: {},
  methods: {
    ...mapMutations(["setUser", "setUserDisc"]),
    userDiscussion() {
      UsersService.getAll()
        .orderBy("date", "asc")
        .onSnapshot((res) => {
          const changes = res.docChanges();
          changes.forEach((change) => {
            if (change.type === "added" || change.type === "updated") {
              console.log(this.getUser.uid);
              if (change.doc.data().id === this.getUser.uid) {
                this.setUserDisc(change.doc.data().discussion);
              }
            }
          });
        });
    },
    userSigned() {
      var response = ChatDataService.getUser();
      console.log("user", response.currentUser);
      if (response.currentUser) {
        this.user = response.currentUser;
        this.setUser(this.user);
      }
    },
    signOff() {
      ChatDataService.getUser()
        .signOut()
        .then(async () => {
          // Sign-out successful.
          console.log("signoff");
          //this.userSigned()
          this.$router.push({ path: "/login" });
        })
        .catch((error) => {
          // An error happened.
          console.log("error signoff", error);
        });
    },
    userStatus() {
      //console.log(UsersService.getAll(), uid);
      console.log("from update app");

      UsersService.update(this.user.uid, { active: false, date: new Date() })
        .then(() => {
          console.log("updated succes");
          this.signOff();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
