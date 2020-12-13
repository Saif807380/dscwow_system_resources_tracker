import { createRouter, createWebHistory } from "vue-router";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import Home from "./pages/Home.vue";
import Dashboard from "./pages/Dashboard.vue";
import Terminal from "./pages/Terminal.vue";

const protector = function (to, from, next) {
  let token = localStorage.getItem("token");
  if(token) {
    next();
  } else {
    next({
      path: "/login"
    })
  }
}

const routes = [
  { path: "/", props: true , beforeEnter: protector},
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/home", component: Home , beforeEnter: protector},
  { path: "/dashboard/:id", component: Dashboard, props: true , beforeEnter: protector},
  { path: "/terminal/:id", component: Terminal, props: true , beforeEnter: protector},
  {
    path: "/logout",
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("user")) localStorage.removeItem("user");
      if (localStorage.getItem("isAuthenticated"))
        localStorage.removeItem("isAuthenticated");
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      next("/login");
    },
  },
  { path: "/:id", props: true , beforeEnter: protector},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
