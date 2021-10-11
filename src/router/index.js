import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/managers",
  },

  {
    path: "/main",
    name: "main",
    component: () => import(/* webpackChunkName: "Main" */ "../pages/Main.vue"),
  },

  {
    path: "/settings",
    name: "settings",
    component: () => import(/* webpackChunkName: "Settings" */ "../pages/Settings.vue"),
  },

  {
    path: "/managers",
    name: "managers",
    component: () => import(/* webpackChunkName: "Managers" */ "../pages/Managers.vue"),
  },


];

const router = new VueRouter({
  routes,
});

export default router;
