import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router";
import moment from "moment";
import VueHtmlToPaper from 'vue-html-to-paper';
import VueMask from 'v-mask'
import './directives/maindirectives';
import {bx24methods} from './utils/methodsBX24'

const options = {
    name: '_blank',
    specs: [
        'fullscreen=yes',
        'titlebar=yes',
        'scrollbars=yes'
    ],
    styles: [],
    timeout: 1000, // default timeout before the print window appears
    autoClose: true, // if false, the window will not close after printing
    windowTitle: window.document.title, // override the window title
}

Vue.use(VueHtmlToPaper, options);
Vue.prototype.$eventBus = new Vue();
Vue.use(VueMask);
Vue.mixin(bx24methods)
Vue.prototype.moment = moment;
Vue.config.productionTip = false


start();

async function start() {
    let {default: BX24Init} = await import('./utils/bx24');
    const BX24 = await BX24Init();

    if (BX24) {

        await BX24.init(function () {
            BX24.callMethod('user.current', {}, async function (res) {
                window.USER = res.answer.result;
                await BX24.callMethod('entity.item.get', {
                    ENTITY: 'SETTINGS',
                    SORT: {DATE_ACTIVE_FROM: 'ASC', ID: 'ASC'},
                    FILTER: {}
                }, (resp) => {
                    if ( window.USER.ID === '1' || window.USER.ID === '110' || JSON.parse(resp.answer.result.find((el)=> el.NAME === 'SUPERUSERS').PROPERTY_VALUES.VALUE).find((el) => el.id === window.USER.ID)) {
                        window.isSuper = true;
                    }
                    new Vue({
                        vuetify,
                        router,
                        render: h => h(App),
                    }).$mount('#app');
                })

            })
            BX24.callMethod("entity.get", {}, (respon) => {
                if (!respon.answer.result.length) {
                    BX24.callMethod('entity.add', {
                        'ENTITY': 'SETTINGS',
                        'NAME': 'SETTINGS',
                        'ACCESS': {AU: 'X'}
                    }, () =>
                    {
                        BX24.callMethod("entity.item.property.add", {
                            ENTITY: 'SETTINGS',
                            PROPERTY: 'VALUE',
                            NAME: 'VALUE',
                            TYPE: 'S'
                        }, () =>
                        {
                           let usrs = BX24.appOption.get('users')? BX24.appOption.get('users') : JSON.stringify([]);
                           let supers = BX24.appOption.get('superUsers')? BX24.appOption.get('superUsers') : JSON.stringify([]);

                            // eslint-disable-next-line no-undef
                            BX24.callMethod('entity.item.add', {
                                ENTITY: 'SETTINGS',
                                NAME: 'HOURRATE',
                                PROPERTY_VALUES: {
                                    // eslint-disable-next-line no-undef
                                    VALUE: usrs
                                },
                            });
                            BX24.callMethod('entity.item.add', {
                                ENTITY: 'SETTINGS',
                                NAME: 'SUPERUSERS',
                                PROPERTY_VALUES: {
                                    VALUE: supers
                                },
                            })
                        })
                    })
                }


            })


        });

    } else {
        new Vue({
            router,
            vuetify,
            render: h => h(App),
        }).$mount('#app');
    }
}
