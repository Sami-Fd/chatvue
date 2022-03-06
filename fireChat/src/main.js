import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store';
import ChatDataService from "./services/ChatDataService";

Vue.config.productionTip = false

let app

const auth = ChatDataService.getUser()
auth.onAuthStateChanged(() => {
    if (!app) {
        new Vue({
            router,
            store,
            vuetify,
            render: h => h(App)
        }).$mount('#app')
    }
})