import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router";
import moment from "moment";
import './directives/maindirectives';
import { bx24methods }  from './utils/methodsBX24'
Vue.prototype.$eventBus = new Vue();

Vue.mixin(bx24methods)
Vue.prototype.moment = moment;
Vue.config.productionTip = false



start();

async function start () {
  let {default: BX24Init} = await import('./utils/bx24');
  const BX24 = await BX24Init();

  if (BX24) {
    await BX24.init(function () {
      new Vue({
        vuetify,
        router,
        render: h => h(App),
      }).$mount('#app');
    });
  } else {
    new Vue({
      router,
      vuetify,
      render: h => h(App),
    }).$mount('#app');
  }
}