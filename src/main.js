import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { bx24methods }  from './utils/methodsBX24'

Vue.mixin(bx24methods)
Vue.config.productionTip = false


start();

async function start () {
  let {default: BX24Init} = await import('./utils/bx24');
  const BX24 = await BX24Init();

  if (BX24) {
    await BX24.init(function () {
      new Vue({
        vuetify,
        render: h => h(App),
      }).$mount('#app');
    });
  } else {
    new Vue({
      vuetify,
      render: h => h(App),
    }).$mount('#app');
  }
}