import { createRouter, createWebHistory } from "vue-router";
import Default from "./pages/Default.vue";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import Home from "./pages/Home.vue";
import Dashboard from "./pages/Dashboard.vue";
import Terminal from "./pages/Terminal.vue";

const routes = [
  { path: "/", component: Default },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/home", component: Home },
  { path: "/dashboard/:id", component: Dashboard, props: true },
  { path: "/terminal/:id", component: Terminal, props: true },
  {
    path: "/logout",
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("user")) localStorage.removeItem("user");
      if (localStorage.getItem("isAuthenticated"))
        localStorage.removeItem("isAuthenticated");
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      next("/");
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
