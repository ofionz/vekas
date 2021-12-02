import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/main",
  },

  {
    path: "/stages",
    name: "stages",
    component: () => import(/* webpackChunkName: "Stages" */ "../pages/Stages.vue"),
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
