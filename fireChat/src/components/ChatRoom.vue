<template>
  <v-row>
    <v-col cols="4">
      <v-text-field
        label="Search"
        solo
        dense
        hide-details
        class="mb-2 rounded-lg"
      ></v-text-field>

      <v-card class="rounded-lg d-flex flex-column overflow-x-auto">
        <v-list subheader two-line>
          <v-subheader>Recent chat</v-subheader>

          <v-list-item
            v-for="(user, idx) in users"
            :key="idx"
            @click="getDiscussion(user.id)"
          >
            <v-badge
              bottom
              :color="user.active ? 'green' : 'grey'"
              dot
              offset-x="10"
              offset-y="10"
              class="mr-2"
            >
              <v-avatar size="40">
                <v-img :alt="`${user.uname} avatar`" :src="user.avatar"></v-img>
              </v-avatar>
            </v-badge>

            <v-list-item-content>
              <v-list-item-title v-text="user.uname"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon>
              <span>{{
                new Date(user.date.toDate()).toTimeString().substring(0, 5)
              }}</span>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="8">
      <v-spacer></v-spacer>
      <v-card
        class="rounded-lg d-flex flex-column-reverse overflow-x-auto"
        height="75vh"
      >
        <v-card-text v-for="msg in msgs" :key="msg.uid">
          <v-card
            width="50%"
            :class="
              msg.id === getUser.uid
                ? 'rounded-lg float-left'
                : 'rounded-lg float-right'
            "
            :color="msg.id === getUser.uid ? 'primary' : 'warning'"
            height="100%"
          >
            <v-card-text class="pa-3">
              <div class="white--text">{{ msg.text }}</div>
              <div class="white--text float-right">
                {{ new Date(msg.date.toDate()).toTimeString().substring(0, 5) }}
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
      <v-text-field
        v-model="mymsg"
        label="Type your text"
        solo
        dense
        hide-details
        clearable
        append-icon="mdi-send"
        append-outer-icon="mdi-paperclip"
        @click:append="sendMsg(getUser.uid)"
        @keyup.enter="sendMsg(getUser.uid)"
        class="my-5 rounded-lg"
      >
        <v-btn icon>mdi-send</v-btn>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import ChatDataService from "../services/ChatDataService";
import UsersService from "../services/UsersService";
//import { firestore } from "../firebase";
import { mapGetters, mapMutations } from "vuex";

export default {
  data: () => ({
    mymsg: "",
    selected: [2],
    users: [],
    msgs: [],
    commingId: null,
  }),
  computed: {
    ...mapGetters(["getUser"]),
    ...mapGetters(["getUserDisc"]),
    ...mapGetters(["getReceiver"]),
  },
  created() {
    //this.getAllMsg();
    this.getAllUsers();
  },
  methods: {
    ...mapMutations(["setReceiver"]),
    async sendMsg(id) {
      //var user = ChatDataService.getUser();
      console.log("from chat:", this.getUser, id);
      /*
      user details:
      uname:this.getUser.displayName,
        photo:this.getUser.photoURL,*/
      var data = {
        id: id,
        receiverId: this.getReceiver,
        text: this.mymsg,
        date: new Date(),
      };
      this.mymsg = "";
      //const db = firestore.collection(id);
      // insert discussion id
      var chatData = await ChatDataService.create(data).catch((e) => {
        console.log(e);
      });
      console.log("msg add succes", chatData.parent.parent.id);

      await UsersService.update(this.getUser.uid, {
        discussion: [chatData.parent.parent.id],
      }).catch((e) => {
        console.log(e);
      });
      console.log("updated succes");
    },
    getAllMsg() {
      ChatDataService.getAll()
        .orderBy("date", "asc")
        .onSnapshot((res) => {
          const changes = res.docChanges();

          changes.forEach((change) => {
            if (change.type === "added") {
              this.msgs.unshift(change.doc.data());
            }
          });
        });
    },
    getAllUsers() {
      UsersService.getAll()
        .orderBy("active", "asc")
        .onSnapshot((res) => {
          const changes = res.docChanges();

          changes.forEach((change) => {
            if (change.type === "added") {
              var user = [];
              if (change.doc.data().id === this.getUser.uid) {
                console.log("users iff", user);
                return this.users.push(...user);
              } else {
                this.users.filter((obj) => obj.id !== change.doc.data().id);
                console.log("Add filter", this.users);
                this.users.push(change.doc.data());
                console.log("Add push", this.users);
              }
            }
            if (change.type === "modified") {
              var empty = [];
              if (change.doc.data().id === this.getUser.uid) {
                console.log("users iff", empty);
                return this.users.push(...empty);
              } else {
                var filtredTab = this.users.filter(
                  (obj) => obj.id !== change.doc.data().id
                );
                filtredTab.push(change.doc.data());
                console.log("Mod filter after push", filtredTab);
                this.users.length = 0; // Clear contents
                this.users.push.apply(this.users, filtredTab); // Append new contents
                //this.users.push(...filtredTab);
                console.log("Mod push", this.users);
              }
              return this.users;
            }
          });
        });
    },
    getDiscussion(id) {
      console.log("discussion", id);
      this.msgs = [];
      this.setReceiver(id);
      //var actualId = id;
      var msgReceiver = [];
      //const db = firestore.collection(this.getUser.uid);
      ChatDataService.getAll(this.getUserDisc[0])
        .orderBy("date", "asc")
        .onSnapshot((res) => {
          const changes = res.docChanges();
          changes.forEach(async (change) => {
            if (change.type === "added") {
              //set msgs
              await msgReceiver.push(change.doc.data());
              var filtredMsgs = msgReceiver.filter(
                (msg) => msg.receiverId === id
              );
              this.msgs.length = 0; // Clear contents
              this.msgs.push.apply(this.msgs, filtredMsgs); // Append new contents
              console.log(change.doc.data(), filtredMsgs);
            }
          });
        });
    },
  },
};
</script>
