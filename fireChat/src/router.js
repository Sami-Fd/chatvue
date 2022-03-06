import Vue from "vue";
import Router from "vue-router";
import ChatDataService from "./services/ChatDataService";

Vue.use(Router);

const routes = [{
        path: "/",
        name: "chatroom",
        component: () =>
            import ("./components/ChatRoom"),
    },
    {
        path: "/login",
        name: "login",
        component: () =>
            import ("./components/login"),
    },
];
const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    console.log("to from", to, from);
    // ...
    if (
        to.path !== "/login" &&
        to.path !== "/register" &&
        to.path !== "/passwordForgot"
    ) {
        checkAuth();
    } else {
        console.log("Other paths...");
    }
    next();
});

function checkAuth() {
    var response = ChatDataService.getUser();
    console.log("user", response.currentUser);
    if (!response.currentUser) {
        console.log("Redirect...");
        router.push("/login");
    } else {
        console.log("User:", response);
    }
}
export default router;