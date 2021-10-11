import Vue from 'vue';

export const bx24methods =  {
    methods: {
        async callMethod(methodName, params) {
            return new Promise(function (resolve, reject) {
               let result = [];
                Vue.prototype.$eventBus.$emit('preloader')
                // eslint-disable-next-line no-undef
                BX24.callMethod(methodName, params, function (response) {
                    if (response.error()){
                        console.error("Ошибка !!! \n"+response.error());
                        reject (response.error())
                    }
                       else {
                        result = result.concat(response.data());
                        if (response.more()) {
                         response.next()
                        }
                        else {
                            Vue.prototype.$eventBus.$emit('preloader')
                            resolve(result);
                        }
                    }
                });
            })

        }      ,
        async pageNavigationMethod(methodName, params) {

            return new Promise(function (resolve, reject) {
               let result = [];
               let pages ;
                Vue.prototype.$eventBus.$emit('preloader')
                // eslint-disable-next-line no-undef
                BX24.callMethod(methodName, params, function (response) {
                    if (response.error()){
                        console.error("Ошибка !!! \n"+response.error());
                        reject (response.error())
                    }
                       else {
                        result = result.concat(response.data());

                        pages = Math.ceil(response.answer.total/50);
                        while (pages> 1) {
                            params[3]['NAV_PARAMS']['iNumPage']++ ;
                            // eslint-disable-next-line no-undef
                            BX24.callMethod(methodName, params, function (response) {
                                result = result.concat(response.data());
                            })
                            pages--;
                        }
                        Vue.prototype.$eventBus.$emit('preloader')
                            resolve(result);
                    }
                });
            })
        }
    },


};

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }